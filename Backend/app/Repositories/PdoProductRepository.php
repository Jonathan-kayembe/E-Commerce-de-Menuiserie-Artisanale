<?php

namespace App\Repositories;

//use PDO; -> permet d'utiliser les constantes PDO
use PDO;
use Illuminate\Support\Facades\DB; // -> permet d'utiliser la classe DB de Laravel pour accéder à la connexion PDO

class PdoProductRepository implements IProductRepository
{
    private PDO $pdo; // -> permet de stocker la connexion PDO

    public function __construct()
    {
        // Récupération de l'instance PDO depuis Laravel 
        $this->pdo = DB::connection()->getPdo();
    }

    // Lire tous les produits (Index)
    public function getAll(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    // Lire un produit par ID (Details)
    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM products WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $product = $stmt->fetch(PDO::FETCH_OBJ);
        return $product ?: null;
    }

    // Créer un nouveau produit (Create)
    public function add(object $product): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO products (name, description, material, color, finish, price, stock, category_id, image_url, slug, is_active)
                       VALUES (:name, :desc, :material, :color, :finish, :price, :stock, :categoryId, :imageUrl, :slug, :isActive)");
        $stmt->bindValue(':name', $product->name, PDO::PARAM_STR);
        $stmt->bindValue(':desc', $product->description, PDO::PARAM_STR);
        $stmt->bindValue(':material', $product->material, PDO::PARAM_STR);
        $stmt->bindValue(':color', $product->color, PDO::PARAM_STR);
        $stmt->bindValue(':finish', $product->finish, PDO::PARAM_STR);
        $stmt->bindValue(':price', $product->price, PDO::PARAM_STR);
        $stmt->bindValue(':stock', $product->stock, PDO::PARAM_INT);
        $stmt->bindValue(':categoryId', $product->category_id, PDO::PARAM_INT);
        $stmt->bindValue(':imageUrl', $product->image_url, PDO::PARAM_STR);
        $stmt->bindValue(':slug', $product->slug, PDO::PARAM_STR);
        $stmt->bindValue(':isActive', $product->is_active ?? true, PDO::PARAM_BOOL);
        $stmt->execute();
    }

    // Modifier un produit (Edit)
    public function update(object $product): bool
    {
        $stmt = $this->pdo->prepare("UPDATE products SET name=:name, description=:desc, material=:material, 
                       color=:color, finish=:finish, price=:price, stock=:stock, category_id=:categoryId, 
                       image_url=:imageUrl, slug=:slug, is_active=:isActive WHERE id=:id");
        $stmt->bindValue(':id', $product->id, PDO::PARAM_INT);
        $stmt->bindValue(':name', $product->name, PDO::PARAM_STR);
        $stmt->bindValue(':desc', $product->description, PDO::PARAM_STR);
        $stmt->bindValue(':material', $product->material, PDO::PARAM_STR);
        $stmt->bindValue(':color', $product->color, PDO::PARAM_STR);
        $stmt->bindValue(':finish', $product->finish, PDO::PARAM_STR);
        $stmt->bindValue(':price', $product->price, PDO::PARAM_STR);
        $stmt->bindValue(':stock', $product->stock, PDO::PARAM_INT);
        $stmt->bindValue(':categoryId', $product->category_id, PDO::PARAM_INT);
        $stmt->bindValue(':imageUrl', $product->image_url, PDO::PARAM_STR);
        $stmt->bindValue(':slug', $product->slug, PDO::PARAM_STR);
        $stmt->bindValue(':isActive', $product->is_active ?? true, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    // Supprimer un produit (Delete)
    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM products WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

