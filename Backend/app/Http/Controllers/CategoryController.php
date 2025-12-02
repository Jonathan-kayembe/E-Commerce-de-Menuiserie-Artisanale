<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ICategoryRepository;

class CategoryController extends Controller
{
    private ICategoryRepository $repo;

    public function __construct(ICategoryRepository $repo)
    {
        $this->repo = $repo;
    }

    public function index()
    {
        $categories = $this->repo->getAll();
        return response()->json($categories, 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => "required|min:3|max:100|unique:categories,name",
            "description" => "nullable|string",
            "slug" => "nullable|string|max:100|unique:categories,slug",
        ]);

        $category = (object) [
            "id" => 0,
            "name" => $data["name"],
            "description" => $data["description"] ?? null,
            "slug" => $data["slug"] ?? \Illuminate\Support\Str::slug($data["name"]),
        ];

        $this->repo->add($category);

        return response()->json([
            "success" => true,
            "message" => "Catégorie ajoutée avec succès.",
            "data" => $category
        ], 201);
    }

    public function show(int $id)
    {
        $category = $this->repo->getById($id);
        if (!$category) {
            return response()->json([
                "success" => false,
                "message" => "Catégorie non trouvée."
            ], 404);
        }
        return response()->json([
            "success" => true,
            "data" => $category
        ], 200);
    }

    public function update(int $id, Request $request)
    {
        $category = $this->repo->getById($id);
        if (!$category) {
            return response()->json([
                "success" => false,
                "message" => "Catégorie non trouvée."
            ], 404);
        }

        $data = $request->validate([
            "name" => "required|min:3|max:100",
            "description" => "nullable|string",
            "slug" => "nullable|string|max:100",
        ]);

        $category = (object) [
            "id" => $id,
            "name" => $data["name"],
            "description" => $data["description"] ?? null,
            "slug" => $data["slug"] ?? \Illuminate\Support\Str::slug($data["name"]),
        ];

        $this->repo->update($category);

        return response()->json([
            "success" => true,
            "message" => "Catégorie modifiée avec succès.",
            "data" => $category
        ], 200);
    }

    public function destroy(int $id)
    {
        $category = $this->repo->getById($id);
        if (!$category) {
            return response()->json([
                "success" => false,
                "message" => "Catégorie non trouvée."
            ], 404);
        }

        $this->repo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Catégorie supprimée avec succès."
        ], 200);
    }
}

