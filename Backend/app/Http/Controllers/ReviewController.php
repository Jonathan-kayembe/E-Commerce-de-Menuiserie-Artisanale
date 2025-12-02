<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IReviewRepository;

class ReviewController extends Controller
{
    private IReviewRepository $repo;

    public function __construct(IReviewRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getByProduct(int $productId)
    {
        $reviews = $this->repo->getByProductId($productId);
        return response()->json($reviews, 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "user_id" => "required|integer|min:1",
            "product_id" => "required|integer|min:1",
            "rating" => "required|integer|min:1|max:5",
            "comment" => "nullable|string",
        ]);

        $review = (object) [
            "id" => 0,
            "user_id" => (int) $data["user_id"],
            "product_id" => (int) $data["product_id"],
            "rating" => (int) $data["rating"],
            "comment" => $data["comment"] ?? null,
        ];

        $this->repo->add($review);

        return response()->json([
            "success" => true,
            "message" => "Avis ajouté avec succès.",
            "data" => $review
        ], 201);
    }

    public function update(int $id, Request $request)
    {
        $review = $this->repo->getById($id);
        if (!$review) {
            return response()->json([
                "success" => false,
                "message" => "Avis non trouvé."
            ], 404);
        }

        $data = $request->validate([
            "rating" => "required|integer|min:1|max:5",
            "comment" => "nullable|string",
        ]);

        $review = (object) [
            "id" => $id,
            "user_id" => $review->user_id,
            "product_id" => $review->product_id,
            "rating" => (int) $data["rating"],
            "comment" => $data["comment"] ?? null,
        ];

        $this->repo->update($review);

        return response()->json([
            "success" => true,
            "message" => "Avis modifié avec succès.",
            "data" => $review
        ], 200);
    }

    public function destroy(int $id)
    {
        $review = $this->repo->getById($id);
        if (!$review) {
            return response()->json([
                "success" => false,
                "message" => "Avis non trouvé."
            ], 404);
        }

        $this->repo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Avis supprimé avec succès."
        ], 200);
    }
}

