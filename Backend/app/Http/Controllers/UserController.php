<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IUserRepository;

/**
 * Contrôleur de gestion des utilisateurs
 * 
 * Gère les opérations de consultation et modification des utilisateurs :
 * - Liste de tous les utilisateurs (index) - généralement réservé aux managers
 * - Affichage d'un utilisateur (show)
 * - Modification d'un utilisateur (update) - profil, rôle, statut
 * - Suppression d'un utilisateur (destroy)
 * 
 * NOTE : L'authentification et l'inscription sont gérées par AuthController.
 * Ce contrôleur est utilisé pour la gestion administrative des comptes.
 * 
 * SÉCURITÉ : Les opérations sensibles (modification de rôle, suppression) devraient
 * être réservées aux managers uniquement.
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class UserController extends Controller
{
    /**
     * Repository pour la gestion des utilisateurs
     * @var IUserRepository
     */
    private IUserRepository $repo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param IUserRepository $repo Repository des utilisateurs
     */
    public function __construct(IUserRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Liste tous les utilisateurs
     * 
     * Retourne la liste complète de tous les utilisateurs (clients et managers).
     * Cette fonctionnalité est généralement réservée aux managers pour la gestion administrative.
     * 
     * IMPORTANT : Ne retourne jamais les mots de passe, même hashés.
     * 
     * @return \Illuminate\Http\JsonResponse Réponse JSON contenant un tableau d'utilisateurs
     * 
     * Code de réponse : 200 (OK)
     */
    public function index()
    {
        // Récupérer tous les utilisateurs depuis la base de données
        // Le repository ne retourne jamais les mots de passe
        $users = $this->repo->getAll();
        
        // Retourner la liste des utilisateurs
        return response()->json($users, 200); // Code HTTP 200 : OK
    }

    /**
     * Affiche les informations d'un utilisateur
     * 
     * Retourne les détails complets d'un utilisateur spécifique.
     * 
     * @param int $id Identifiant unique de l'utilisateur
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Utilisateur trouvé et retourné
     * - 404 : Utilisateur non trouvé
     */
    public function show(int $id)
    {
        // Récupérer l'utilisateur depuis la base de données
        $user = $this->repo->getById($id);
        
        // Vérifier que l'utilisateur existe
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }
        
        // Retourner les informations de l'utilisateur (sans le mot de passe)
        return response()->json([
            "success" => true,
            "data" => $user
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Met à jour les informations d'un utilisateur
     * 
     * Permet de modifier les informations d'un utilisateur (nom, email, rôle, statut, mot de passe).
     * Seuls les champs fournis sont mis à jour (mise à jour partielle).
     * 
     * SÉCURITÉ : La modification du rôle et du statut devrait être réservée aux managers.
     * Le mot de passe est automatiquement hashé par le repository.
     * 
     * @param int $id Identifiant unique de l'utilisateur à modifier
     * @param Request $request Requête HTTP contenant les nouvelles données
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Utilisateur modifié avec succès
     * - 404 : Utilisateur non trouvé
     * - 422 : Erreurs de validation
     */
    public function update(int $id, Request $request)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'EXISTENCE
        // ============================================
        $user = $this->repo->getById($id);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 2 : VALIDATION DES DONNÉES
        // ============================================
        $data = $request->validate([
            "full_name" => "nullable|string|min:3|max:100",    // Nom optionnel, 3-100 caractères
            "email" => "nullable|email|max:100",              // Email optionnel, format valide
            "role" => "nullable|string|in:client,manager",   // Rôle optionnel, valeurs autorisées
            "is_active" => "nullable|boolean",                // Statut actif optionnel
            "password" => "nullable|string|min:8",            // Mot de passe optionnel, min 8 caractères
        ]);

        // ============================================
        // ÉTAPE 3 : PRÉPARATION DE L'OBJET UTILISATEUR
        // ============================================
        // Mise à jour partielle : conserver les valeurs existantes si non fournies
        $user = (object) [
            "id" => $id,
            "full_name" => $data["full_name"] ?? $user->full_name,
            "email" => $data["email"] ?? $user->email,
            "role" => $data["role"] ?? $user->role,
            "is_active" => $data["is_active"] ?? $user->is_active,
            "password" => $data["password"] ?? null, // Sera hashé par le repository si fourni
        ];

        // ============================================
        // ÉTAPE 4 : MISE À JOUR DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->update($user);

        // ============================================
        // ÉTAPE 5 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Utilisateur modifié avec succès.",
            "data" => $user
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Supprime un utilisateur
     * 
     * ATTENTION : Cette opération est irréversible et supprime définitivement l'utilisateur.
     * Il est recommandé de désactiver le compte (is_active = false) plutôt que de le supprimer.
     * 
     * La suppression d'un utilisateur peut affecter :
     * - Ses commandes (à gérer selon les règles métier)
     * - Son panier (supprimé automatiquement par CASCADE)
     * - Ses adresses (à gérer selon les règles métier)
     * 
     * @param int $id Identifiant unique de l'utilisateur à supprimer
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Utilisateur supprimé avec succès
     * - 404 : Utilisateur non trouvé
     */
    public function destroy(int $id)
    {
        // ============================================
        // ÉTAPE 1 : VÉRIFICATION DE L'EXISTENCE
        // ============================================
        $user = $this->repo->getById($id);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 2 : SUPPRESSION DANS LA BASE DE DONNÉES
        // ============================================
        $this->repo->delete($id);

        // ============================================
        // ÉTAPE 3 : RETOUR DE LA RÉPONSE
        // ============================================
        return response()->json([
            "success" => true,
            "message" => "Utilisateur supprimé avec succès."
        ], 200); // Code HTTP 200 : OK
    }
}

