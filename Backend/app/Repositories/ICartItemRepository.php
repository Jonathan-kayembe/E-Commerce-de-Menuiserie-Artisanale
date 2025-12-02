<?php

namespace App\Repositories;

interface ICartItemRepository {
    /** @return array<int, object> */
    public function getByCartId(int $cartId): array;
    public function getById(int $id): ?object;
    public function add(object $cartItem): void;
    public function update(object $cartItem): bool;
    public function delete(int $id): bool;
}

