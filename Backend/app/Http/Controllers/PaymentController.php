<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IPaymentRepository;

/**
 * Contrôleur de gestion des paiements
 * 
 * Gère toutes les opérations liées aux paiements des commandes :
 * - Récupération du paiement d'une commande (getByOrder)
 * - Création d'un paiement (store)
 * - Modification d'un paiement (update) - statut, méthode, etc.
 * - Suppression d'un paiement (destroy)
 * 
 * Les paiements sont associés à une commande et peuvent avoir différents statuts :
 * - "en attente" : Paiement en cours de traitement
 * - "réussi" : Paiement validé
 * - "échoué" : Paiement refusé
 * - "annulé" : Paiement annulé
 * 
 * NOTE : Dans cette application, les paiements sont simulés (fictifs).
 * En production, il faudrait intégrer un vrai système de paiement (Stripe, PayPal, etc.).
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class PaymentController extends Controller
{
    /**
     * Repository pour la gestion des paiements
     * @var IPaymentRepository
     */
    private IPaymentRepository $repo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param IPaymentRepository $repo Repository des paiements
     */
    public function __construct(IPaymentRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Récupère le paiement associé à une commande
     * 
     * Retourne les informations de paiement d'une commande spécifique.
     * Une commande ne peut avoir qu'un seul paiement.
     * 
     * @param int $orderId Identifiant unique de la commande
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Paiement trouvé et retourné
     * - 404 : Paiement non trouvé
     */
    public function getByOrder(int $orderId)
    {
        // Récupérer le paiement associé à la commande
        $payment = $this->repo->getByOrderId($orderId);
        
        // Vérifier que le paiement existe
        if (!$payment) {
            return response()->json([
                "success" => false,
                "message" => "Paiement non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }
        
        // Retourner les informations du paiement
        return response()->json([
            "success" => true,
            "data" => $payment
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Crée un nouveau paiement pour une commande
     * 
     * Cette méthode crée un enregistrement de paiement associé à une commande.
     * Le statut par défaut est "en attente" si non spécifié.
     * 
     * NOTE : Dans cette application, les paiements sont simulés.
     * En production, cette méthode devrait interagir avec un vrai système de paiement.
     * 
     * @param Request $request Requête HTTP contenant :
     *                        - order_id : Identifiant de la commande (requis)
     *                        - method : Méthode de paiement (requis: carte_bancaire, virement, cheque)
     *                        - amount : Montant du paiement (requis, positif)
     *                        - status : Statut du paiement (optionnel, défaut: "en attente")
     *                        - transaction_id : ID de transaction (optionnel)
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 201 : Paiement créé avec succès
     * - 422 : Erreurs de validation
     */
    public function store(Request $request)
    {
        // ============================================
        // ÉTAPE 1 : VALIDATION DES DONNÉES
        // ============================================
        $data = $request->validate([
            "order_id" => "required|integer|min:1",                    // ID de la commande requis
            "method" => "required|string|in:carte_bancaire,virement,cheque", // Méthode requise, valeurs autorisées
            "amount" => "required|numeric|min:0",                     // Montant requis, positif
            "status" => "nullable|string|in:en attente,réussi,échoué,annulé", // Statut optionnel
            "transaction_id" => "nullable|string|max:255",            // ID de transaction optionnel
        ]);

        // ============================================
        // ÉTAPE 2 : PRÉPARATION DE L'OBJET PAIEMENT
        // ============================================
        $payment = (object) [
            "id" => 0,                                                 // ID temporaire (sera généré par la BDD)
            "order_id" => (int) $data["order_id"],
            "method" => $data["method"],                               // Méthode de paiement
            "amount" => (float) $data["amount"],                       // Montant du paiement
            "status" => $data["status"] ?? "en attente",              // Statut par défaut: "en attente"
            "transaction_id" => $data["transaction_id"] ?? null,      // ID de transaction (généré par le système de paiement)
        ];

        // ============================================
        // ÉTAPE 3 : CRÉATION DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->add($payment);

        // ============================================
        // ÉTAPE 4 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Paiement ajouté avec succès.",
            "data" => $payment
        ], 201); // Code HTTP 201 : Created
    }

    /**
     * Met à jour un paiement existant
     * 
     * Permet de modifier les informations d'un paiement (méthode, montant, statut, transaction_id).
     * Seuls les champs fournis sont mis à jour (mise à jour partielle).
     * 
     * Utilisé notamment pour mettre à jour le statut après traitement par un système de paiement.
     * 
     * @param int $id Identifiant unique du paiement à modifier
     * @param Request $request Requête HTTP contenant les nouvelles données
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Paiement modifié avec succès
     * - 404 : Paiement non trouvé
     * - 422 : Erreurs de validation
     */
    public function update(int $id, Request $request)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'EXISTENCE
        // ============================================
        $payment = $this->repo->getById($id);
        if (!$payment) {
            return response()->json([
                "success" => false,
                "message" => "Paiement non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 2 : VALIDATION DES DONNÉES
        // ============================================
        $data = $request->validate([
            "method" => "nullable|string|in:carte_bancaire,virement,cheque", // Méthode optionnelle
            "amount" => "nullable|numeric|min:0",                          // Montant optionnel, positif
            "status" => "nullable|string|in:en attente,réussi,échoué,annulé", // Statut optionnel
            "transaction_id" => "nullable|string|max:255",                 // ID de transaction optionnel
        ]);

        // ============================================
        // ÉTAPE 3 : PRÉPARATION DE L'OBJET PAIEMENT
        // ============================================
        // Mise à jour partielle : conserver les valeurs existantes si non fournies
        $payment = (object) [
            "id" => $id,
            "order_id" => $payment->order_id,                              // Conserver la commande d'origine
            "method" => $data["method"] ?? $payment->method,
            "amount" => $data["amount"] ?? $payment->amount,
            "status" => $data["status"] ?? $payment->status,
            "transaction_id" => $data["transaction_id"] ?? $payment->transaction_id,
        ];

        // ============================================
        // ÉTAPE 4 : MISE À JOUR DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->update($payment);

        // ============================================
        // ÉTAPE 5 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Paiement modifié avec succès.",
            "data" => $payment
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Supprime un paiement
     * 
     * ATTENTION : La suppression d'un paiement peut affecter l'historique financier.
     * Il est généralement préférable de marquer le paiement comme "annulé" plutôt que de le supprimer.
     * 
     * @param int $id Identifiant unique du paiement à supprimer
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Paiement supprimé avec succès
     * - 404 : Paiement non trouvé
     */
    public function destroy(int $id)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'EXISTENCE
        // ============================================
        $payment = $this->repo->getById($id);
        if (!$payment) {
            return response()->json([
                "success" => false,
                "message" => "Paiement non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 2 : SUPPRESSION DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->delete($id);

        // ============================================
        // ÉTAPE 3 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Paiement supprimé avec succès."
        ], 200); // Code HTTP 200 : OK
    }
}

