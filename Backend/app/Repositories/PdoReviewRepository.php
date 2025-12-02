<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoReviewRepository implements IReviewRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getByProductId(int $productId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM reviews WHERE product_id=:productId ORDER BY created_at DESC");
        $stmt->bindValue(':productId', $productId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM reviews WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $review = $stmt->fetch(PDO::FETCH_OBJ);
        return $review ?: null;
    }

    public function add(object $review): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO reviews (user_id, product_id, rating, comment)
                       VALUES (:userId, :productId, :rating, :comment)");
        $stmt->bindValue(':userId', $review->user_id, PDO::PARAM_INT);
        $stmt->bindValue(':productId', $review->product_id, PDO::PARAM_INT);
        $stmt->bindValue(':rating', $review->rating, PDO::PARAM_INT);
        $stmt->bindValue(':comment', $review->comment, PDO::PARAM_STR);
        $stmt->execute();
    }

    public function update(object $review): bool
    {
        $stmt = $this->pdo->prepare("UPDATE reviews SET rating=:rating, comment=:comment WHERE id=:id");
        $stmt->bindValue(':id', $review->id, PDO::PARAM_INT);
        $stmt->bindValue(':rating', $review->rating, PDO::PARAM_INT);
        $stmt->bindValue(':comment', $review->comment, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM reviews WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

