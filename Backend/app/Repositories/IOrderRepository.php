<?php

namespace App\Repositories;

interface IOrderRepository {
    /** @return array<int, object> */
    public function getAll(): array;
    public function getById(int $id): ?object;
    public function getByUserId(int $userId): array;
    public function add(object $order): void;
    public function update(object $order): bool;
    public function delete(int $id): bool;
    public function getLastInsertId(): int;
}

