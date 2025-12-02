<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ICartItemRepository;
use App\Repositories\IProductRepository;

class CartItemController extends Controller
{
    private ICartItemRepository $repo;
    private IProductRepository $productRepo;

    public function __construct(ICartItemRepository $repo, IProductRepository $productRepo)
    {
        $this->repo = $repo;
        $this->productRepo = $productRepo;
    }

    public function getByCart(int $cartId)
    {
        $cartItems = $this->repo->getByCartId($cartId);
        
        // Enrichir chaque item avec les informations du produit
        $enrichedItems = [];
        foreach ($cartItems as $item) {
            $product = $this->productRepo->getById($item->product_id);
            
            // Si le produit n'existe plus, ne pas l'inclure dans la réponse
            if (!$product) {
                // Supprimer l'item du panier car le produit n'existe plus
                $this->repo->delete($item->id);
                continue;
            }
            
            // Ajouter les informations du produit à l'item
            $item->product = $product;
            $enrichedItems[] = $item;
        }
        
        return response()->json($enrichedItems, 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "cart_id" => "required|integer|min:1",
            "product_id" => "required|integer|min:1",
            "quantity" => "required|integer|min:1",
            "customization" => "nullable|array",
        ]);

        $cartItem = (object) [
            "id" => 0,
            "cart_id" => (int) $data["cart_id"],
            "product_id" => (int) $data["product_id"],
            "quantity" => (int) $data["quantity"],
            "customization" => $data["customization"] ?? null,
        ];

        $this->repo->add($cartItem);

        return response()->json([
            "success" => true,
            "message" => "Article ajouté au panier avec succès.",
            "data" => $cartItem
        ], 201);
    }

    public function update(int $id, Request $request)
    {
        $cartItem = $this->repo->getById($id);
        if (!$cartItem) {
            return response()->json([
                "success" => false,
                "message" => "Article non trouvé."
            ], 404);
        }

        // Vérifier que le produit existe toujours
        $product = $this->productRepo->getById($cartItem->product_id);
        if (!$product) {
            // Supprimer l'item car le produit n'existe plus
            $this->repo->delete($id);
            return response()->json([
                "success" => false,
                "message" => "Le produit associé à cet article n'existe plus."
            ], 404);
        }

        $data = $request->validate([
            "quantity" => "required|integer|min:1",
            "customization" => "nullable|array",
        ]);

        $cartItem = (object) [
            "id" => $id,
            "cart_id" => $cartItem->cart_id,
            "product_id" => $cartItem->product_id,
            "quantity" => (int) $data["quantity"],
            "customization" => $data["customization"] ?? null,
        ];

        $this->repo->update($cartItem);
        
        // Enrichir avec les informations du produit
        $cartItem->product = $product;

        return response()->json([
            "success" => true,
            "message" => "Article modifié avec succès.",
            "data" => $cartItem
        ], 200);
    }

    public function destroy(int $id)
    {
        $cartItem = $this->repo->getById($id);
        if (!$cartItem) {
            return response()->json([
                "success" => false,
                "message" => "Article non trouvé."
            ], 404);
        }

        $this->repo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Article supprimé avec succès."
        ], 200);
    }
}

