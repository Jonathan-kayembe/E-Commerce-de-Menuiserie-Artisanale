<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IOrderItemRepository;

class OrderItemController extends Controller
{
    private IOrderItemRepository $repo;

    public function __construct(IOrderItemRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getByOrder(int $orderId)
    {
        $orderItems = $this->repo->getByOrderId($orderId);
        return response()->json($orderItems, 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "order_id" => "required|integer|min:1",
            "product_id" => "required|integer|min:1",
            "quantity" => "required|integer|min:1",
            "unit_price" => "required|numeric|min:0",
            "subtotal" => "required|numeric|min:0",
            "customization" => "nullable|array",
        ]);

        $orderItem = (object) [
            "id" => 0,
            "order_id" => (int) $data["order_id"],
            "product_id" => (int) $data["product_id"],
            "quantity" => (int) $data["quantity"],
            "unit_price" => (float) $data["unit_price"],
            "subtotal" => (float) $data["subtotal"],
            "customization" => $data["customization"] ?? null,
        ];

        $this->repo->add($orderItem);

        return response()->json([
            "success" => true,
            "message" => "Article de commande ajouté avec succès.",
            "data" => $orderItem
        ], 201);
    }

    public function update(int $id, Request $request)
    {
        $orderItem = $this->repo->getById($id);
        if (!$orderItem) {
            return response()->json([
                "success" => false,
                "message" => "Article de commande non trouvé."
            ], 404);
        }

        $data = $request->validate([
            "quantity" => "required|integer|min:1",
            "unit_price" => "required|numeric|min:0",
            "subtotal" => "required|numeric|min:0",
            "customization" => "nullable|array",
        ]);

        $orderItem = (object) [
            "id" => $id,
            "order_id" => $orderItem->order_id,
            "product_id" => $orderItem->product_id,
            "quantity" => (int) $data["quantity"],
            "unit_price" => (float) $data["unit_price"],
            "subtotal" => (float) $data["subtotal"],
            "customization" => $data["customization"] ?? null,
        ];

        $this->repo->update($orderItem);

        return response()->json([
            "success" => true,
            "message" => "Article de commande modifié avec succès.",
            "data" => $orderItem
        ], 200);
    }

    public function destroy(int $id)
    {
        $orderItem = $this->repo->getById($id);
        if (!$orderItem) {
            return response()->json([
                "success" => false,
                "message" => "Article de commande non trouvé."
            ], 404);
        }

        $this->repo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Article de commande supprimé avec succès."
        ], 200);
    }
}

