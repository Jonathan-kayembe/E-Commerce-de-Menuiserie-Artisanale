<?php

namespace App\Repositories;

interface ICategoryRepository {
    /** @return array<int, object> */
    public function getAll(): array;
    public function getById(int $id): ?object;
    public function add(object $category): void;
    public function update(object $category): bool;
    public function delete(int $id): bool;
}

