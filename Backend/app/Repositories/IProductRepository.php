<?php

namespace App\Repositories;

interface IProductRepository {
    /** @return array<int, object> */
    public function getAll(): array;
    public function getById(int $id): ?object;
    public function add(object $product): void;
    public function update(object $product): bool;
    public function delete(int $id): bool;
}

