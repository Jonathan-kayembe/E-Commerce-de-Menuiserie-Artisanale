<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ICartRepository;
use App\Repositories\IUserRepository;
use App\Repositories\ICartItemRepository;

/**
 * Contrôleur de gestion des paniers
 * 
 * Gère toutes les opérations liées aux paniers d'achat des utilisateurs :
 * - Récupération du panier d'un utilisateur (getByUser)
 * - Création d'un panier (store)
 * - Suppression/Vidage d'un panier (destroy)
 * 
 * Chaque utilisateur possède un seul panier qui contient plusieurs articles (CartItems).
 * Le panier est automatiquement créé lors de la première utilisation.
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class CartController extends Controller
{
    /**
     * Repository pour la gestion des paniers
     * @var ICartRepository
     */
    private ICartRepository $repo;
    
    /**
     * Repository pour la gestion des utilisateurs
     * @var IUserRepository
     */
    private IUserRepository $userRepo;
    
    /**
     * Repository pour la gestion des articles du panier
     * @var ICartItemRepository
     */
    private ICartItemRepository $cartItemRepo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param ICartRepository $repo Repository des paniers
     * @param IUserRepository $userRepo Repository des utilisateurs
     * @param ICartItemRepository $cartItemRepo Repository des articles du panier
     */
    public function __construct(ICartRepository $repo, IUserRepository $userRepo, ICartItemRepository $cartItemRepo)
    {
        $this->repo = $repo;
        $this->userRepo = $userRepo;
        $this->cartItemRepo = $cartItemRepo;
    }

    /**
     * Récupère le panier d'un utilisateur
     * 
     * Retourne le panier complet d'un utilisateur avec tous ses articles.
     * Si le panier n'existe pas, une erreur 404 est retournée.
     * 
     * @param int $userId Identifiant unique de l'utilisateur
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Panier trouvé et retourné
     * - 404 : Utilisateur ou panier non trouvé
     */
    public function getByUser(int $userId)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'UTILISATEUR
        // ============================================
        // Vérifier que l'utilisateur existe dans la base de données
        $user = $this->userRepo->getById($userId);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 2 : RÉCUPÉRATION DU PANIER
        // ============================================
        // Récupérer le panier de l'utilisateur depuis la base de données
        $cart = $this->repo->getByUserId($userId);
        
        // Vérifier que le panier existe
        if (!$cart) {
            return response()->json([
                "success" => false,
                "message" => "Panier non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }
        
        // ============================================
        // ÉTAPE 3 : RETOUR DE LA RÉPONSE
        // ============================================
        // Retourner le panier avec tous ses articles
        return response()->json([
            "success" => true,
            "data" => $cart
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Crée un nouveau panier pour l'utilisateur authentifié
     * 
     * Cette méthode crée un panier pour l'utilisateur connecté.
     * Si l'utilisateur possède déjà un panier, celui-ci est retourné au lieu d'en créer un nouveau.
     * 
     * SÉCURITÉ : L'utilisateur est récupéré depuis le middleware d'authentification,
     * pas depuis les données de la requête (protection contre l'usurpation d'identité).
     * 
     * @param Request $request Requête HTTP (l'utilisateur est extrait du token d'authentification)
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 201 : Panier créé avec succès
     * - 200 : Panier existant retourné
     * - 401 : Utilisateur non authentifié
     * - 404 : Utilisateur non trouvé dans la base de données
     */
    public function store(Request $request)
    {
        // ============================================
        // ÉTAPE 1 : RÉCUPÉRATION DE L'UTILISATEUR AUTHENTIFIÉ
        // ============================================
        // Utiliser l'utilisateur authentifié depuis le middleware au lieu de celui envoyé par le client
        // SÉCURITÉ : Empêche l'usurpation d'identité
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non authentifié."
            ], 401); // Code HTTP 401 : Unauthorized
        }

        // ============================================
        // ÉTAPE 2 : VÉRIFICATION DANS LA BASE DE DONNÉES
        // ============================================
        // Vérifier que l'utilisateur existe vraiment dans la base de données
        // (double vérification de sécurité)
        $dbUser = $this->userRepo->getById($user->id);
        if (!$dbUser) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé dans la base de données."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 3 : VÉRIFICATION D'UN PANIER EXISTANT
        // ============================================
        // Vérifier si l'utilisateur a déjà un panier
        // Un utilisateur ne peut avoir qu'un seul panier actif à la fois
        $existingCart = $this->repo->getByUserId($user->id);
        if ($existingCart) {
            // Retourner le panier existant au lieu d'en créer un nouveau
            return response()->json([
                "success" => true,
                "message" => "Panier existant récupéré.",
                "data" => $existingCart
            ], 200); // Code HTTP 200 : OK
        }

        // ============================================
        // ÉTAPE 4 : CRÉATION DU NOUVEAU PANIER
        // ============================================
        $cart = (object) [
            "id" => 0,                          // ID temporaire (sera généré par la BDD)
            "user_id" => (int) $user->id,      // ID de l'utilisateur propriétaire
        ];

        // Créer le panier dans la base de données
        $this->repo->add($cart);

        // ============================================
        // ÉTAPE 5 : RÉCUPÉRATION DU PANIER CRÉÉ
        // ============================================
        // Récupérer le panier créé avec son ID généré par la base de données
        $createdCart = $this->repo->getByUserId($user->id);

        // ============================================
        // ÉTAPE 6 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Panier créé avec succès.",
            "data" => $createdCart
        ], 201); // Code HTTP 201 : Created
    }

    /**
     * Supprime/Vide un panier
     * 
     * Cette méthode supprime un panier et tous ses articles.
     * Les articles du panier (cart_items) sont supprimés automatiquement par CASCADE.
     * 
     * SÉCURITÉ : Vérifie que le panier appartient bien à l'utilisateur authentifié
     * pour empêcher la suppression de paniers d'autres utilisateurs.
     * 
     * @param int $id Identifiant unique du panier à supprimer
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Panier supprimé avec succès
     * - 401 : Utilisateur non authentifié
     * - 404 : Panier non trouvé ou accès refusé
     */
    public function destroy(int $id)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'AUTHENTIFICATION
        // ============================================
        // Vérifier que l'utilisateur est authentifié
        $authenticatedUser = request()->user();
        if (!$authenticatedUser) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non authentifié."
            ], 401); // Code HTTP 401 : Unauthorized
        }

        // ============================================
        // ÉTAPE 2 : VÉRIFICATION DE LA PROPRIÉTÉ DU PANIER
        // ============================================
        // SÉCURITÉ : Vérifier que le panier appartient à l'utilisateur authentifié
        // Empêche la suppression de paniers d'autres utilisateurs
        $cart = $this->repo->getByUserId($authenticatedUser->id);
        if (!$cart || (int) $cart->id !== (int) $id) {
            return response()->json([
                "success" => false,
                "message" => "Panier non trouvé ou accès refusé."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 3 : SUPPRESSION DU PANIER
        // ============================================
        // Supprimer le panier (les cart_items seront supprimés automatiquement par CASCADE)
        // La contrainte CASCADE dans la base de données garantit la cohérence
        $this->repo->delete($id);

        // ============================================
        // ÉTAPE 4 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Panier vidé avec succès."
        ], 200); // Code HTTP 200 : OK
    }
}

