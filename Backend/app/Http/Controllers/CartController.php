<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ICartRepository;
use App\Repositories\IUserRepository;
use App\Repositories\ICartItemRepository;

class CartController extends Controller
{
    private ICartRepository $repo;
    private IUserRepository $userRepo;
    private ICartItemRepository $cartItemRepo;

    public function __construct(ICartRepository $repo, IUserRepository $userRepo, ICartItemRepository $cartItemRepo)
    {
        $this->repo = $repo;
        $this->userRepo = $userRepo;
        $this->cartItemRepo = $cartItemRepo;
    }

    public function getByUser(int $userId)
    {
        // Vérifier que l'utilisateur existe
        $user = $this->userRepo->getById($userId);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404);
        }

        $cart = $this->repo->getByUserId($userId);
        if (!$cart) {
            return response()->json([
                "success" => false,
                "message" => "Panier non trouvé."
            ], 404);
        }
        return response()->json([
            "success" => true,
            "data" => $cart
        ], 200);
    }

    public function store(Request $request)
    {
        // Utiliser l'utilisateur authentifié depuis le middleware au lieu de celui envoyé par le client
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non authentifié."
            ], 401);
        }

        // Vérifier que l'utilisateur existe vraiment dans la base de données
        $dbUser = $this->userRepo->getById($user->id);
        if (!$dbUser) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé dans la base de données."
            ], 404);
        }

        // Vérifier si l'utilisateur a déjà un panier
        $existingCart = $this->repo->getByUserId($user->id);
        if ($existingCart) {
            return response()->json([
                "success" => true,
                "message" => "Panier existant récupéré.",
                "data" => $existingCart
            ], 200);
        }

        $cart = (object) [
            "id" => 0,
            "user_id" => (int) $user->id,
        ];

        $this->repo->add($cart);

        // Récupérer le panier créé avec son ID
        $createdCart = $this->repo->getByUserId($user->id);

        return response()->json([
            "success" => true,
            "message" => "Panier créé avec succès.",
            "data" => $createdCart
        ], 201);
    }

    public function destroy(int $id)
    {
        // Vérifier que le panier appartient à l'utilisateur authentifié
        $authenticatedUser = request()->user();
        if (!$authenticatedUser) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non authentifié."
            ], 401);
        }

        $cart = $this->repo->getByUserId($authenticatedUser->id);
        if (!$cart || (int) $cart->id !== (int) $id) {
            return response()->json([
                "success" => false,
                "message" => "Panier non trouvé ou accès refusé."
            ], 404);
        }

        // Supprimer le panier (les cart_items seront supprimés automatiquement par CASCADE)
        $this->repo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Panier vidé avec succès."
        ], 200);
    }
}

