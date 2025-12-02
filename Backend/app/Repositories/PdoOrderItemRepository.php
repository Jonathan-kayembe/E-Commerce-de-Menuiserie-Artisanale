<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoOrderItemRepository implements IOrderItemRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getByOrderId(int $orderId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM order_items WHERE order_id=:orderId ORDER BY created_at DESC");
        $stmt->bindValue(':orderId', $orderId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM order_items WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $orderItem = $stmt->fetch(PDO::FETCH_OBJ);
        return $orderItem ?: null;
    }

    public function add(object $orderItem): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, customization)
                       VALUES (:orderId, :productId, :quantity, :unitPrice, :subtotal, :customization)");
        $stmt->bindValue(':orderId', $orderItem->order_id, PDO::PARAM_INT);
        $stmt->bindValue(':productId', $orderItem->product_id, PDO::PARAM_INT);
        $stmt->bindValue(':quantity', $orderItem->quantity, PDO::PARAM_INT);
        $stmt->bindValue(':unitPrice', $orderItem->unit_price, PDO::PARAM_STR);
        $stmt->bindValue(':subtotal', $orderItem->subtotal, PDO::PARAM_STR);
        $customizationJson = $orderItem->customization ? json_encode($orderItem->customization) : null;
        $stmt->bindValue(':customization', $customizationJson, PDO::PARAM_STR);
        $stmt->execute();
    }

    public function update(object $orderItem): bool
    {
        $stmt = $this->pdo->prepare("UPDATE order_items SET quantity=:quantity, unit_price=:unitPrice, 
                       subtotal=:subtotal, customization=:customization WHERE id=:id");
        $stmt->bindValue(':id', $orderItem->id, PDO::PARAM_INT);
        $stmt->bindValue(':quantity', $orderItem->quantity, PDO::PARAM_INT);
        $stmt->bindValue(':unitPrice', $orderItem->unit_price, PDO::PARAM_STR);
        $stmt->bindValue(':subtotal', $orderItem->subtotal, PDO::PARAM_STR);
        $customizationJson = $orderItem->customization ? json_encode($orderItem->customization) : null;
        $stmt->bindValue(':customization', $customizationJson, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM order_items WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

