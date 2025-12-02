<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoCartRepository implements ICartRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getByUserId(int $userId): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM carts WHERE user_id=:userId");
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $cart = $stmt->fetch(PDO::FETCH_OBJ);
        return $cart ?: null;
    }

    public function add(object $cart): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO carts (user_id) VALUES (:userId)");
        $stmt->bindValue(':userId', $cart->user_id, PDO::PARAM_INT);
        $stmt->execute();
        
        // Récupérer l'ID du panier créé
        $cart->id = (int) $this->pdo->lastInsertId();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM carts WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

