<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoAddressRepository implements IAddressRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getByUserId(int $userId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM addresses WHERE user_id=:userId ORDER BY is_default DESC, created_at DESC");
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM addresses WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $address = $stmt->fetch(PDO::FETCH_OBJ);
        return $address ?: null;
    }

    public function add(object $address): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO addresses (user_id, street, city, postal_code, country, phone, is_default)
                       VALUES (:userId, :street, :city, :postalCode, :country, :phone, :isDefault)");
        $stmt->bindValue(':userId', $address->user_id, PDO::PARAM_INT);
        $stmt->bindValue(':street', $address->street, PDO::PARAM_STR);
        $stmt->bindValue(':city', $address->city, PDO::PARAM_STR);
        $stmt->bindValue(':postalCode', $address->postal_code, PDO::PARAM_STR);
        $stmt->bindValue(':country', $address->country, PDO::PARAM_STR);
        $stmt->bindValue(':phone', $address->phone, PDO::PARAM_STR);
        $stmt->bindValue(':isDefault', $address->is_default ?? false, PDO::PARAM_BOOL);
        $stmt->execute();
    }

    public function update(object $address): bool
    {
        $stmt = $this->pdo->prepare("UPDATE addresses SET street=:street, city=:city, postal_code=:postalCode, 
                       country=:country, phone=:phone, is_default=:isDefault WHERE id=:id");
        $stmt->bindValue(':id', $address->id, PDO::PARAM_INT);
        $stmt->bindValue(':street', $address->street, PDO::PARAM_STR);
        $stmt->bindValue(':city', $address->city, PDO::PARAM_STR);
        $stmt->bindValue(':postalCode', $address->postal_code, PDO::PARAM_STR);
        $stmt->bindValue(':country', $address->country, PDO::PARAM_STR);
        $stmt->bindValue(':phone', $address->phone, PDO::PARAM_STR);
        $stmt->bindValue(':isDefault', $address->is_default ?? false, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM addresses WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

