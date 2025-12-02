<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PdoUserRepository implements IUserRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function getAll(): array
    {
        $stmt = $this->pdo->query("SELECT id, full_name, email, COALESCE(role, 'client') as role, COALESCE(is_active, 1) as is_active, created_at, updated_at FROM users ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById(int $id): ?object
    {
        $stmt = $this->pdo->prepare("SELECT id, full_name, email, COALESCE(role, 'client') as role, COALESCE(is_active, 1) as is_active, created_at, updated_at FROM users WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_OBJ);
        return $user ?: null;
    }

    public function getByEmail(string $email): ?object
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email=:email");
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_OBJ);
        return $user ?: null;
    }

    public function add(object $user): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO users (full_name, email, password, role, is_active)
                       VALUES (:fullName, :email, :password, :role, :isActive)");
        $stmt->bindValue(':fullName', $user->full_name, PDO::PARAM_STR);
        $stmt->bindValue(':email', $user->email, PDO::PARAM_STR);
        $stmt->bindValue(':password', Hash::make($user->password), PDO::PARAM_STR);
        $stmt->bindValue(':role', $user->role ?? 'client', PDO::PARAM_STR);
        $stmt->bindValue(':isActive', $user->is_active ?? true, PDO::PARAM_BOOL);
        $stmt->execute();
    }

    public function update(object $user): bool
    {
        $sql = "UPDATE users SET full_name=:fullName, email=:email, role=:role, is_active=:isActive";
        $params = [
            ':id' => $user->id,
            ':fullName' => $user->full_name,
            ':email' => $user->email,
            ':role' => $user->role,
            ':isActive' => $user->is_active ?? true,
        ];

        if (isset($user->password) && $user->password) {
            $sql .= ", password=:password";
            $params[':password'] = Hash::make($user->password);
        }

        $sql .= " WHERE id=:id";

        $stmt = $this->pdo->prepare($sql);
        foreach ($params as $key => $value) {
            $type = $key === ':id' ? PDO::PARAM_INT : ($key === ':isActive' ? PDO::PARAM_BOOL : PDO::PARAM_STR);
            $stmt->bindValue($key, $value, $type);
        }
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

