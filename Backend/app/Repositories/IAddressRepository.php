<?php

namespace App\Repositories;

interface IAddressRepository {
    /** @return array<int, object> */
    public function getByUserId(int $userId): array;
    public function getById(int $id): ?object;
    public function add(object $address): void;
    public function update(object $address): bool;
    public function delete(int $id): bool;
}

