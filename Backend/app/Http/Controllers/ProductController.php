<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IProductRepository;

/**
 * Contrôleur de gestion des produits
 * 
 * Gère toutes les opérations CRUD sur les produits du catalogue :
 * - Liste de tous les produits (index)
 * - Création d'un produit (store)
 * - Affichage d'un produit (show)
 * - Modification d'un produit (update)
 * - Suppression d'un produit (destroy)
 * 
 * Les produits représentent les articles vendus dans l'e-commerce de menuiserie.
 * Chaque produit appartient à une catégorie et possède des caractéristiques
 * spécifiques (matériau, couleur, finition, prix, stock, etc.).
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class ProductController extends Controller
{
    /**
     * Repository pour la gestion des produits
     * @var IProductRepository
     */
    private IProductRepository $repo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * Le constructeur reçoit automatiquement le Repository via l'injection de dépendance de Laravel.
     * 
     * @param IProductRepository $repo Repository des produits
     */
    public function __construct(IProductRepository $repo)
    {
        $this->repo = $repo;
    }

    // INDEX — liste tous les produits
    public function index()
    {
        $products = $this->repo->getAll();//demande au Repository de récupérer tous les produits de la base de données.
// retourne une réponse JSON avec tous les produits
        return response()->json($products, 200);
    }

    // STORE — ajoute un produit (validation)
    public function store(Request $request) // valide les données du formulaire 
    {
        $data = $request->validate([
            "name" => "required|min:3|max:200", // le nom est obligatoire, doit être une chaîne de 3 à 200 caractères.
            "description" => "nullable|string", // la description est optionnelle
            "material" => "nullable|string|max:100", // le matériau est optionnel
            "color" => "nullable|string|max:100", // la couleur est optionnelle
            "finish" => "nullable|string|max:100", // la finition est optionnelle
            "price" => "required|numeric|min:0", // le prix est obligatoire, doit être un nombre positif
            "stock" => "required|integer|min:0", // le stock est obligatoire, doit être un entier positif
            "category_id" => "required|integer|min:1", // la catégorie est obligatoire, doit être un entier positif
            "image_url" => "nullable|string|max:255", // l'URL de l'image est optionnelle
            "slug" => "nullable|string|max:200", // le slug est optionnel
            "is_active" => "nullable|boolean", // le statut actif est optionnel
        ]);

        $product = (object) [
            "id" => 0,
            "name" => $data["name"],
            "description" => $data["description"] ?? null,
            "material" => $data["material"] ?? null,
            "color" => $data["color"] ?? null,
            "finish" => $data["finish"] ?? null,
            "price" => (float) $data["price"],
            "stock" => (int) $data["stock"],
            "category_id" => (int) $data["category_id"],
            "image_url" => $data["image_url"] ?? null,
            "slug" => $data["slug"] ?? \Illuminate\Support\Str::slug($data["name"]),
            "is_active" => $data["is_active"] ?? true,
        ];

        $this->repo->add($product); // demande au Repository d'ajouter le produit dans la base de données

        return response()->json([
            "success" => true,
            "message" => "Produit ajouté avec succès.",
            "data" => $product
        ], 201);
    }

    // SHOW — affiche les informations d'un produit
    public function show(int $id)
    {
        $product = $this->repo->getById($id);// récupère le produit avec l'ID spécifié
        if (!$product) { //  vérifie si le produit existe. Si non, retourne une erreur 404.
            return response()->json([
                "success" => false,
                "message" => "Produit non trouvé."
            ], 404);
        }   
        return response()->json([
            "success" => true,
            "data" => $product
        ], 200);
    }

    // UPDATE — met à jour un produit
    public function update(int $id, Request $request)
    {
        $product = $this->repo->getById($id);
        if (!$product) {
            return response()->json([
                "success" => false,
                "message" => "Produit non trouvé."
            ], 404);
        }

        $data = $request->validate([
            "name" => "required|min:3|max:200",
            "description" => "nullable|string",
            "material" => "nullable|string|max:100",
            "color" => "nullable|string|max:100",
            "finish" => "nullable|string|max:100",
            "price" => "required|numeric|min:0",
            "stock" => "required|integer|min:0",
            "category_id" => "required|integer|min:1",
            "image_url" => "nullable|string|max:255",
            "slug" => "nullable|string|max:200",
            "is_active" => "nullable|boolean",
        ]);

        // Récupérer l'image_url existante si non fournie
        $existingProduct = $this->repo->getById($id);
        $imageUrl = $data["image_url"] ?? $existingProduct->image_url ?? null;

        $product = (object) [
            "id" => $id,
            "name" => trim($data["name"]),
            "description" => $data["description"] ? trim($data["description"]) : null,
            "material" => $data["material"] ? trim($data["material"]) : null,
            "color" => $data["color"] ? trim($data["color"]) : null,
            "finish" => $data["finish"] ? trim($data["finish"]) : null,
            "price" => (float) $data["price"],
            "stock" => (int) $data["stock"],
            "category_id" => (int) $data["category_id"],
            "image_url" => $imageUrl,
            "slug" => $data["slug"] ?? \Illuminate\Support\Str::slug($data["name"]),
            "is_active" => $data["is_active"] ?? true,
        ];

        $this->repo->update($product); // demande au Repository de mettre à jour le produit dans la base de données

        return response()->json([
            "success" => true,
            "message" => "Produit modifié avec succès.",
            "data" => $product
        ], 200);
    }

    // DESTROY — supprime le produit
    public function destroy(int $id)
    {
        $product = $this->repo->getById($id);
        if (!$product) {
            return response()->json([
                "success" => false,
                "message" => "Produit non trouvé."
            ], 404);
        }

        $this->repo->delete($id); // demande au Repository de supprimer le produit de la base de données.
        
        return response()->json([
            "success" => true,
            "message" => "Produit supprimé avec succès."
        ], 200);
    }
}

