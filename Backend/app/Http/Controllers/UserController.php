<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IUserRepository;

class UserController extends Controller
{
    private IUserRepository $repo;

    public function __construct(IUserRepository $repo)
    {
        $this->repo = $repo;
    }

    // INDEX — liste tous les utilisateurs
    public function index()
    {
        $users = $this->repo->getAll();
        return response()->json($users, 200);
    }

    // SHOW — affiche les informations d'un utilisateur
    public function show(int $id)
    {
        $user = $this->repo->getById($id);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404);
        }
        return response()->json([
            "success" => true,
            "data" => $user
        ], 200);
    }

    // UPDATE — met à jour un utilisateur
    public function update(int $id, Request $request)
    {
        $user = $this->repo->getById($id);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404);
        }

        $data = $request->validate([
            "full_name" => "nullable|string|min:3|max:100",
            "email" => "nullable|email|max:100",
            "role" => "nullable|string|in:client,manager",
            "is_active" => "nullable|boolean",
            "password" => "nullable|string|min:8",
        ]);

        $user = (object) [
            "id" => $id,
            "full_name" => $data["full_name"] ?? $user->full_name,
            "email" => $data["email"] ?? $user->email,
            "role" => $data["role"] ?? $user->role,
            "is_active" => $data["is_active"] ?? $user->is_active,
            "password" => $data["password"] ?? null,
        ];

        $this->repo->update($user);

        return response()->json([
            "success" => true,
            "message" => "Utilisateur modifié avec succès.",
            "data" => $user
        ], 200);
    }

    // DESTROY — supprime l'utilisateur
    public function destroy(int $id)
    {
        $user = $this->repo->getById($id);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404);
        }

        $this->repo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Utilisateur supprimé avec succès."
        ], 200);
    }
}

