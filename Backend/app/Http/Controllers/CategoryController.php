<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ICategoryRepository;

/**
 * Contrôleur de gestion des catégories
 * 
 * Gère toutes les opérations CRUD sur les catégories de produits :
 * - Liste des catégories (index)
 * - Création d'une catégorie (store)
 * - Affichage d'une catégorie (show)
 * - Modification d'une catégorie (update)
 * - Suppression d'une catégorie (destroy)
 * 
 * Les catégories permettent d'organiser les produits par type (ex: Tables, Chaises, Armoires).
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class CategoryController extends Controller
{
    /**
     * Repository pour la gestion des catégories
     * @var ICategoryRepository
     */
    private ICategoryRepository $repo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param ICategoryRepository $repo Repository des catégories
     */
    public function __construct(ICategoryRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Liste toutes les catégories
     * 
     * Retourne la liste complète des catégories disponibles dans le catalogue.
     * Utilisé pour afficher le menu de navigation par catégories.
     * 
     * @return \Illuminate\Http\JsonResponse Réponse JSON contenant un tableau de catégories
     * 
     * Code de réponse : 200 (OK)
     */
    public function index()
    {
        // Récupérer toutes les catégories depuis la base de données
        $categories = $this->repo->getAll();
        
        // Retourner la liste des catégories
        return response()->json($categories, 200);
    }

    /**
     * Crée une nouvelle catégorie
     * 
     * Cette méthode permet d'ajouter une nouvelle catégorie au catalogue.
     * Le slug est généré automatiquement à partir du nom si non fourni.
     * 
     * @param Request $request Requête HTTP contenant :
     *                        - name : Nom de la catégorie (requis, unique, 3-100 caractères)
     *                        - description : Description de la catégorie (optionnel)
     *                        - slug : Identifiant URL-friendly (optionnel, généré automatiquement si non fourni)
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 201 : Catégorie créée avec succès
     * - 422 : Erreurs de validation (nom déjà utilisé, données invalides)
     */
    public function store(Request $request)
    {
        // ============================================
        // ÉTAPE 1 : VALIDATION DES DONNÉES
        // ============================================
        $data = $request->validate([
            "name" => "required|min:3|max:100|unique:categories,name",        // Nom unique, 3-100 caractères
            "description" => "nullable|string",                               // Description optionnelle
            "slug" => "nullable|string|max:100|unique:categories,slug",      // Slug optionnel, unique
        ]);

        // ============================================
        // ÉTAPE 2 : PRÉPARATION DE L'OBJET CATÉGORIE
        // ============================================
        $category = (object) [
            "id" => 0,                                                         // ID temporaire (sera généré par la BDD)
            "name" => $data["name"],
            "description" => $data["description"] ?? null,
            // Génération automatique du slug si non fourni (ex: "Tables en bois" -> "tables-en-bois")
            "slug" => $data["slug"] ?? \Illuminate\Support\Str::slug($data["name"]),
        ];

        // ============================================
        // ÉTAPE 3 : CRÉATION DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->add($category);

        // ============================================
        // ÉTAPE 4 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Catégorie ajoutée avec succès.",
            "data" => $category
        ], 201); // Code HTTP 201 : Created
    }

    /**
     * Affiche les détails d'une catégorie
     * 
     * Retourne les informations complètes d'une catégorie spécifique.
     * 
     * @param int $id Identifiant unique de la catégorie
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Catégorie trouvée et retournée
     * - 404 : Catégorie non trouvée
     */
    public function show(int $id)
    {
        // Récupérer la catégorie depuis la base de données
        $category = $this->repo->getById($id);
        
        // Vérifier que la catégorie existe
        if (!$category) {
            return response()->json([
                "success" => false,
                "message" => "Catégorie non trouvée."
            ], 404); // Code HTTP 404 : Not Found
        }
        
        // Retourner les informations de la catégorie
        return response()->json([
            "success" => true,
            "data" => $category
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Met à jour une catégorie existante
     * 
     * Permet de modifier les informations d'une catégorie (nom, description, slug).
     * Le slug est régénéré automatiquement si le nom change et qu'aucun slug n'est fourni.
     * 
     * @param int $id Identifiant unique de la catégorie à modifier
     * @param Request $request Requête HTTP contenant les nouvelles données
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Catégorie modifiée avec succès
     * - 404 : Catégorie non trouvée
     * - 422 : Erreurs de validation
     */
    public function update(int $id, Request $request)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'EXISTENCE
        // ============================================
        $category = $this->repo->getById($id);
        if (!$category) {
            return response()->json([
                "success" => false,
                "message" => "Catégorie non trouvée."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 2 : VALIDATION DES DONNÉES
        // ============================================
        $data = $request->validate([
            "name" => "required|min:3|max:100",        // Nom requis, 3-100 caractères
            "description" => "nullable|string",        // Description optionnelle
            "slug" => "nullable|string|max:100",      // Slug optionnel
        ]);

        // ============================================
        // ÉTAPE 3 : PRÉPARATION DE L'OBJET CATÉGORIE
        // ============================================
        $category = (object) [
            "id" => $id,
            "name" => $data["name"],
            "description" => $data["description"] ?? null,
            // Régénérer le slug si non fourni (basé sur le nouveau nom)
            "slug" => $data["slug"] ?? \Illuminate\Support\Str::slug($data["name"]),
        ];

        // ============================================
        // ÉTAPE 4 : MISE À JOUR DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->update($category);

        // ============================================
        // ÉTAPE 5 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Catégorie modifiée avec succès.",
            "data" => $category
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Supprime une catégorie
     * 
     * ATTENTION : La suppression d'une catégorie peut affecter les produits associés.
     * Il est recommandé de vérifier qu'aucun produit n'utilise cette catégorie avant suppression.
     * 
     * @param int $id Identifiant unique de la catégorie à supprimer
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Catégorie supprimée avec succès
     * - 404 : Catégorie non trouvée
     */
    public function destroy(int $id)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'EXISTENCE
        // ============================================
        $category = $this->repo->getById($id);
        if (!$category) {
            return response()->json([
                "success" => false,
                "message" => "Catégorie non trouvée."
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
            "message" => "Catégorie supprimée avec succès."
        ], 200); // Code HTTP 200 : OK
    }
}

