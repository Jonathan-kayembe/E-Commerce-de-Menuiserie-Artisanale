<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoPaymentRepository implements IPaymentRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getByOrderId(int $orderId): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM payments WHERE order_id=:orderId");
        $stmt->bindValue(':orderId', $orderId, PDO::PARAM_INT);
        $stmt->execute();
        $payment = $stmt->fetch(PDO::FETCH_OBJ);
        return $payment ?: null;
    }

    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM payments WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $payment = $stmt->fetch(PDO::FETCH_OBJ);
        return $payment ?: null;
    }

    public function add(object $payment): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO payments (order_id, method, amount, status, transaction_id)
                       VALUES (:orderId, :method, :amount, :status, :transactionId)");
        $stmt->bindValue(':orderId', $payment->order_id, PDO::PARAM_INT);
        $stmt->bindValue(':method', $payment->method, PDO::PARAM_STR);
        $stmt->bindValue(':amount', $payment->amount, PDO::PARAM_STR);
        $stmt->bindValue(':status', $payment->status, PDO::PARAM_STR);
        $stmt->bindValue(':transactionId', $payment->transaction_id, PDO::PARAM_STR);
        $stmt->execute();
    }

    public function update(object $payment): bool
    {
        $stmt = $this->pdo->prepare("UPDATE payments SET method=:method, amount=:amount, status=:status, transaction_id=:transactionId WHERE id=:id");
        $stmt->bindValue(':id', $payment->id, PDO::PARAM_INT);
        $stmt->bindValue(':method', $payment->method, PDO::PARAM_STR);
        $stmt->bindValue(':amount', $payment->amount, PDO::PARAM_STR);
        $stmt->bindValue(':status', $payment->status, PDO::PARAM_STR);
        $stmt->bindValue(':transactionId', $payment->transaction_id, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM payments WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

