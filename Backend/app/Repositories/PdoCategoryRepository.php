<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoCategoryRepository implements ICategoryRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getAll(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM categories ORDER BY name ASC");
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM categories WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $category = $stmt->fetch(PDO::FETCH_OBJ);
        return $category ?: null;
    }

    public function add(object $category): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO categories (name, description, slug)
                       VALUES (:name, :desc, :slug)");
        $stmt->bindValue(':name', $category->name, PDO::PARAM_STR);
        $stmt->bindValue(':desc', $category->description, PDO::PARAM_STR);
        $stmt->bindValue(':slug', $category->slug, PDO::PARAM_STR);
        $stmt->execute();
    }

    public function update(object $category): bool
    {
        $stmt = $this->pdo->prepare("UPDATE categories SET name=:name, description=:desc, slug=:slug WHERE id=:id");
        $stmt->bindValue(':id', $category->id, PDO::PARAM_INT);
        $stmt->bindValue(':name', $category->name, PDO::PARAM_STR);
        $stmt->bindValue(':desc', $category->description, PDO::PARAM_STR);
        $stmt->bindValue(':slug', $category->slug, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM categories WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

