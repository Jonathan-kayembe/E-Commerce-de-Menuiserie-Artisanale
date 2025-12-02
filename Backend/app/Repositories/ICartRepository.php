<?php

namespace App\Repositories;

interface ICartRepository {
    public function getByUserId(int $userId): ?object;
    public function add(object $cart): void;
    public function delete(int $id): bool;
}

