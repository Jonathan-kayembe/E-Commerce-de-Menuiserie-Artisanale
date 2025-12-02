<?php

namespace App\Repositories;

interface IReviewRepository {
    /** @return array<int, object> */
    public function getByProductId(int $productId): array;
    public function getById(int $id): ?object;
    public function add(object $review): void;
    public function update(object $review): bool;
    public function delete(int $id): bool;
}

