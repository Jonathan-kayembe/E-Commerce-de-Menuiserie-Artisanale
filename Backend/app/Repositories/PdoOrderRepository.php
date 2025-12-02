<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoOrderRepository implements IOrderRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getAll(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $order = $stmt->fetch(PDO::FETCH_OBJ);
        return $order ?: null;
    }

    public function getByUserId(int $userId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE user_id=:userId ORDER BY created_at DESC");
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function add(object $order): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO orders (user_id, status, total_price, shipping_address_id, billing_address_id, tracking_number, notes)
                       VALUES (:userId, :status, :totalPrice, :shippingAddressId, :billingAddressId, :trackingNumber, :notes)");
        $stmt->bindValue(':userId', $order->user_id, PDO::PARAM_INT);
        $stmt->bindValue(':status', $order->status, PDO::PARAM_STR);
        $stmt->bindValue(':totalPrice', $order->total_price, PDO::PARAM_STR);
        $stmt->bindValue(':shippingAddressId', $order->shipping_address_id, $order->shipping_address_id ? PDO::PARAM_INT : PDO::PARAM_NULL);
        $stmt->bindValue(':billingAddressId', $order->billing_address_id, $order->billing_address_id ? PDO::PARAM_INT : PDO::PARAM_NULL);
        $stmt->bindValue(':trackingNumber', $order->tracking_number, PDO::PARAM_STR);
        $stmt->bindValue(':notes', $order->notes, PDO::PARAM_STR);
        $stmt->execute();
    }

    public function update(object $order): bool
    {
        $stmt = $this->pdo->prepare("UPDATE orders SET status=:status, total_price=:totalPrice, 
                       shipping_address_id=:shippingAddressId, billing_address_id=:billingAddressId, 
                       tracking_number=:trackingNumber, notes=:notes WHERE id=:id");
        $stmt->bindValue(':id', $order->id, PDO::PARAM_INT);
        $stmt->bindValue(':status', $order->status, PDO::PARAM_STR);
        $stmt->bindValue(':totalPrice', $order->total_price, PDO::PARAM_STR);
        $stmt->bindValue(':shippingAddressId', $order->shipping_address_id, PDO::PARAM_INT);
        $stmt->bindValue(':billingAddressId', $order->billing_address_id, PDO::PARAM_INT);
        $stmt->bindValue(':trackingNumber', $order->tracking_number, PDO::PARAM_STR);
        $stmt->bindValue(':notes', $order->notes, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM orders WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getLastInsertId(): int
    {
        return (int) $this->pdo->lastInsertId();
    }
}

