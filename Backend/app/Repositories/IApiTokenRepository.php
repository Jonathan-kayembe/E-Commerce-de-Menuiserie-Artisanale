<?php

namespace App\Repositories;

interface IApiTokenRepository {
    public function create(int $userId, string $token, ?int $expiresInMinutes = null): void;
    public function findByToken(string $token): ?object;
    public function deleteByToken(string $token): bool;
    public function deleteByUserId(int $userId): bool;
}

