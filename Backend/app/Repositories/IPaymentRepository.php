<?php

namespace App\Repositories;

interface IPaymentRepository {
    public function getByOrderId(int $orderId): ?object;
    public function getById(int $id): ?object;
    public function add(object $payment): void;
    public function update(object $payment): bool;
    public function delete(int $id): bool;
}

