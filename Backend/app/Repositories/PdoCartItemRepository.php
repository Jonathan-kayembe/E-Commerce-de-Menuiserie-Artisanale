<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoCartItemRepository implements ICartItemRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getByCartId(int $cartId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM cart_items WHERE cart_id=:cartId ORDER BY created_at DESC");
        $stmt->bindValue(':cartId', $cartId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM cart_items WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $cartItem = $stmt->fetch(PDO::FETCH_OBJ);
        return $cartItem ?: null;
    }

    public function add(object $cartItem): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO cart_items (cart_id, product_id, quantity, customization)
                       VALUES (:cartId, :productId, :quantity, :customization)");
        $stmt->bindValue(':cartId', $cartItem->cart_id, PDO::PARAM_INT);
        $stmt->bindValue(':productId', $cartItem->product_id, PDO::PARAM_INT);
        $stmt->bindValue(':quantity', $cartItem->quantity, PDO::PARAM_INT);
        $customizationJson = $cartItem->customization ? json_encode($cartItem->customization) : null;
        $stmt->bindValue(':customization', $customizationJson, PDO::PARAM_STR);
        $stmt->execute();
    }

    public function update(object $cartItem): bool
    {
        $stmt = $this->pdo->prepare("UPDATE cart_items SET quantity=:quantity, customization=:customization WHERE id=:id");
        $stmt->bindValue(':id', $cartItem->id, PDO::PARAM_INT);
        $stmt->bindValue(':quantity', $cartItem->quantity, PDO::PARAM_INT);
        $customizationJson = $cartItem->customization ? json_encode($cartItem->customization) : null;
        $stmt->bindValue(':customization', $customizationJson, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM cart_items WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

