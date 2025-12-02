<?php

namespace App\Repositories;

interface IOrderItemRepository {
    /** @return array<int, object> */
    public function getByOrderId(int $orderId): array;
    public function getById(int $id): ?object;
    public function add(object $orderItem): void;
    public function update(object $orderItem): bool;
    public function delete(int $id): bool;
}

