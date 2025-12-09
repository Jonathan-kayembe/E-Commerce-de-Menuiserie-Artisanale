<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ICartItemRepository;
use App\Repositories\IProductRepository;

/**
 * Contrôleur de gestion des articles du panier
 * 
 * Gère toutes les opérations CRUD sur les articles (items) d'un panier :
 * - Liste des articles d'un panier (getByCart)
 * - Ajout d'un article au panier (store)
 * - Modification d'un article (update) - quantité, personnalisation
 * - Suppression d'un article (destroy)
 * 
 * Les articles du panier représentent les produits que l'utilisateur souhaite acheter.
 * Chaque article contient une référence au produit, une quantité et des options de personnalisation.
 * 
 * SÉCURITÉ : Vérifie automatiquement que les produits existent toujours.
 * Les articles de produits supprimés sont automatiquement retirés du panier.
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class CartItemController extends Controller
{
    /**
     * Repository pour la gestion des articles du panier
     * @var ICartItemRepository
     */
    private ICartItemRepository $repo;
    
    /**
     * Repository pour la gestion des produits
     * @var IProductRepository
     */
    private IProductRepository $productRepo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param ICartItemRepository $repo Repository des articles du panier
     * @param IProductRepository $productRepo Repository des produits
     */
    public function __construct(ICartItemRepository $repo, IProductRepository $productRepo)
    {
        $this->repo = $repo;
        $this->productRepo = $productRepo;
    }

    /**
     * Récupère tous les articles d'un panier
     * 
     * Retourne la liste complète des articles d'un panier avec les informations détaillées
     * de chaque produit associé (nom, prix, image, etc.).
     * 
     * NETTOYAGE AUTOMATIQUE : Si un produit a été supprimé depuis l'ajout au panier,
     * l'article correspondant est automatiquement retiré du panier.
     * 
     * @param int $cartId Identifiant unique du panier
     * @return \Illuminate\Http\JsonResponse Réponse JSON contenant un tableau d'articles enrichis
     * 
     * Code de réponse : 200 (OK)
     */
    public function getByCart(int $cartId)
    {
        // ============================================
        // ÉTAPE 1 : RÉCUPÉRATION DES ARTICLES
        // ============================================
        // Récupérer tous les articles du panier depuis la base de données
        $cartItems = $this->repo->getByCartId($cartId);
        
        // ============================================
        // ÉTAPE 2 : ENRICHISSEMENT ET NETTOYAGE
        // ============================================
        // Enrichir chaque item avec les informations complètes du produit
        $enrichedItems = [];
        foreach ($cartItems as $item) {
            // Récupérer les informations du produit associé
            $product = $this->productRepo->getById($item->product_id);
            
            // Si le produit n'existe plus, nettoyer le panier automatiquement
            if (!$product) {
                // Supprimer l'item du panier car le produit n'existe plus
                // Cela évite d'afficher des articles invalides
                $this->repo->delete($item->id);
                continue; // Passer au prochain article
            }
            
            // Ajouter les informations complètes du produit à l'item
            // Permet au frontend d'afficher nom, prix, image, etc.
            $item->product = $product;
            $enrichedItems[] = $item;
        }
        
        // ============================================
        // ÉTAPE 3 : RETOUR DE LA RÉPONSE
        // ============================================
        // Retourner la liste des articles enrichis
        return response()->json($enrichedItems, 200); // Code HTTP 200 : OK
    }

    /**
     * Ajoute un article au panier
     * 
     * Cette méthode permet d'ajouter un produit au panier avec une quantité spécifiée.
     * Des options de personnalisation peuvent être associées à l'article.
     * 
     * @param Request $request Requête HTTP contenant :
     *                        - cart_id : Identifiant du panier (requis)
     *                        - product_id : Identifiant du produit à ajouter (requis)
     *                        - quantity : Quantité désirée (requis, minimum 1)
     *                        - customization : Options de personnalisation (optionnel, tableau)
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 201 : Article ajouté avec succès
     * - 422 : Erreurs de validation
     */
    public function store(Request $request)
    {
        // ============================================
        // ÉTAPE 1 : VALIDATION DES DONNÉES
        // ============================================
        $data = $request->validate([
            "cart_id" => "required|integer|min:1",        // ID du panier requis
            "product_id" => "required|integer|min:1",     // ID du produit requis
            "quantity" => "required|integer|min:1",       // Quantité requise, minimum 1
            "customization" => "nullable|array",          // Personnalisation optionnelle
        ]);

        // ============================================
        // ÉTAPE 2 : PRÉPARATION DE L'OBJET ARTICLE
        // ============================================
        $cartItem = (object) [
            "id" => 0,                                     // ID temporaire (sera généré par la BDD)
            "cart_id" => (int) $data["cart_id"],
            "product_id" => (int) $data["product_id"],
            "quantity" => (int) $data["quantity"],
            "customization" => $data["customization"] ?? null, // Options de personnalisation (ex: dimensions, finition)
        ];

        // ============================================
        // ÉTAPE 3 : CRÉATION DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->add($cartItem);

        // ============================================
        // ÉTAPE 4 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Article ajouté au panier avec succès.",
            "data" => $cartItem
        ], 201); // Code HTTP 201 : Created
    }

    /**
     * Met à jour un article du panier
     * 
     * Permet de modifier la quantité ou les options de personnalisation d'un article.
     * Vérifie automatiquement que le produit associé existe toujours.
     * 
     * @param int $id Identifiant unique de l'article à modifier
     * @param Request $request Requête HTTP contenant les nouvelles données
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Article modifié avec succès
     * - 404 : Article non trouvé ou produit associé supprimé
     * - 422 : Erreurs de validation
     */
    public function update(int $id, Request $request)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'EXISTENCE
        // ============================================
        $cartItem = $this->repo->getById($id);
        if (!$cartItem) {
            return response()->json([
                "success" => false,
                "message" => "Article non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 2 : VÉRIFICATION DU PRODUIT
        // ============================================
        // Vérifier que le produit associé existe toujours
        $product = $this->productRepo->getById($cartItem->product_id);
        if (!$product) {
            // Supprimer l'item car le produit n'existe plus
            // Nettoyage automatique du panier
            $this->repo->delete($id);
            return response()->json([
                "success" => false,
                "message" => "Le produit associé à cet article n'existe plus."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 3 : VALIDATION DES DONNÉES
        // ============================================
        $data = $request->validate([
            "quantity" => "required|integer|min:1",       // Quantité requise, minimum 1
            "customization" => "nullable|array",          // Personnalisation optionnelle
        ]);

        // ============================================
        // ÉTAPE 4 : PRÉPARATION DE L'OBJET ARTICLE
        // ============================================
        $cartItem = (object) [
            "id" => $id,
            "cart_id" => $cartItem->cart_id,              // Conserver le panier d'origine
            "product_id" => $cartItem->product_id,        // Conserver le produit d'origine
            "quantity" => (int) $data["quantity"],         // Nouvelle quantité
            "customization" => $data["customization"] ?? null, // Nouvelles options de personnalisation
        ];

        // ============================================
        // ÉTAPE 5 : MISE À JOUR DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->update($cartItem);
        
        // ============================================
        // ÉTAPE 6 : ENRICHISSEMENT DE LA RÉPONSE
        // ============================================
        // Enrichir avec les informations complètes du produit
        $cartItem->product = $product;

        // ============================================
        // ÉTAPE 7 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Article modifié avec succès.",
            "data" => $cartItem
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Supprime un article du panier
     * 
     * Retire un article spécifique du panier. L'article est définitivement supprimé.
     * 
     * @param int $id Identifiant unique de l'article à supprimer
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Article supprimé avec succès
     * - 404 : Article non trouvé
     */
    public function destroy(int $id)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'EXISTENCE
        // ============================================
        $cartItem = $this->repo->getById($id);
        if (!$cartItem) {
            return response()->json([
                "success" => false,
                "message" => "Article non trouvé."
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
            "message" => "Article supprimé avec succès."
        ], 200); // Code HTTP 200 : OK
    }
}

