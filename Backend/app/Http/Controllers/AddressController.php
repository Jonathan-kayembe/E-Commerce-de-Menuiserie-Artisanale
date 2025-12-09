<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IAddressRepository;

/**
 * Contrôleur de gestion des adresses
 * 
 * Gère toutes les opérations CRUD sur les adresses de livraison et de facturation :
 * - Liste des adresses d'un utilisateur (getByUser)
 * - Création d'une adresse (store)
 * - Affichage d'une adresse (show)
 * - Modification d'une adresse (update)
 * - Suppression d'une adresse (destroy)
 * 
 * Les adresses sont utilisées pour la livraison et la facturation des commandes.
 * Un utilisateur peut avoir plusieurs adresses et en définir une par défaut.
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class AddressController extends Controller
{
    /**
     * Repository pour la gestion des adresses
     * @var IAddressRepository
     */
    private IAddressRepository $repo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param IAddressRepository $repo Repository des adresses
     */
    public function __construct(IAddressRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getByUser(int $userId)
    {
        $addresses = $this->repo->getByUserId($userId);
        return response()->json($addresses, 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "user_id" => "required|integer|min:1",
            "street" => "required|string|max:255",
            "city" => "required|string|max:100",
            "postal_code" => "required|string|max:20",
            "country" => "required|string|max:100",
            "phone" => "nullable|string|max:20",
            "is_default" => "nullable|boolean",
        ]);

        $address = (object) [
            "id" => 0,
            "user_id" => (int) $data["user_id"],
            "street" => $data["street"],
            "city" => $data["city"],
            "postal_code" => $data["postal_code"],
            "country" => $data["country"],
            "phone" => $data["phone"] ?? null,
            "is_default" => $data["is_default"] ?? false,
        ];

        $this->repo->add($address);

        return response()->json([
            "success" => true,
            "message" => "Adresse ajoutée avec succès.",
            "data" => $address
        ], 201);
    }

    public function show(int $id)
    {
        $address = $this->repo->getById($id);
        if (!$address) {
            return response()->json([
                "success" => false,
                "message" => "Adresse non trouvée."
            ], 404);
        }
        return response()->json([
            "success" => true,
            "data" => $address
        ], 200);
    }

    public function update(int $id, Request $request)
    {
        $address = $this->repo->getById($id);
        if (!$address) {
            return response()->json([
                "success" => false,
                "message" => "Adresse non trouvée."
            ], 404);
        }

        $data = $request->validate([
            "street" => "required|string|max:255",
            "city" => "required|string|max:100",
            "postal_code" => "required|string|max:20",
            "country" => "required|string|max:100",
            "phone" => "nullable|string|max:20",
            "is_default" => "nullable|boolean",
        ]);

        $address = (object) [
            "id" => $id,
            "user_id" => $address->user_id,
            "street" => $data["street"],
            "city" => $data["city"],
            "postal_code" => $data["postal_code"],
            "country" => $data["country"],
            "phone" => $data["phone"] ?? null,
            "is_default" => $data["is_default"] ?? false,
        ];

        $this->repo->update($address);

        return response()->json([
            "success" => true,
            "message" => "Adresse modifiée avec succès.",
            "data" => $address
        ], 200);
    }

    public function destroy(int $id)
    {
        $address = $this->repo->getById($id);
        if (!$address) {
            return response()->json([
                "success" => false,
                "message" => "Adresse non trouvée."
            ], 404);
        }

        $this->repo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Adresse supprimée avec succès."
        ], 200);
    }
}

