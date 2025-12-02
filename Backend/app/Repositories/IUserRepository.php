<?php

namespace App\Repositories;

interface IUserRepository {
    /** @return array<int, object> */
    public function getAll(): array;
    public function getById(int $id): ?object;
    public function getByEmail(string $email): ?object;
    public function add(object $user): void;
    public function update(object $user): bool;
    public function delete(int $id): bool;
}

