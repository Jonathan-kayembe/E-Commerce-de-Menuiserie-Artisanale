<?php

namespace App\Repositories;

/**
 * Interface du repository des utilisateurs
 * 
 * Définit le contrat pour toutes les opérations CRUD sur les utilisateurs.
 * Cette interface suit le pattern Repository qui permet de :
 * - Séparer la logique d'accès aux données de la logique métier
 * - Faciliter les tests unitaires (mock des repositories)
 * - Permettre de changer l'implémentation (PDO, Eloquent, etc.) sans modifier les contrôleurs
 * 
 * @package App\Repositories
 * @author Jonathan Kayembe
 */
interface IUserRepository {
    /**
     * Récupère tous les utilisateurs de la base de données
     * 
     * @return array<int, object> Tableau d'objets utilisateurs, triés par date de création décroissante
     */
    public function getAll(): array;
    
    /**
     * Récupère un utilisateur par son identifiant
     * 
     * @param int $id Identifiant unique de l'utilisateur
     * @return object|null Objet utilisateur ou null si non trouvé
     */
    public function getById(int $id): ?object;
    
    /**
     * Récupère un utilisateur par son adresse email
     * 
     * Utilisé principalement pour l'authentification (login).
     * L'email est unique dans la base de données.
     * 
     * @param string $email Adresse email de l'utilisateur
     * @return object|null Objet utilisateur ou null si non trouvé
     */
    public function getByEmail(string $email): ?object;
    
    /**
     * Ajoute un nouvel utilisateur dans la base de données
     * 
     * Le mot de passe sera automatiquement hashé par l'implémentation.
     * 
     * @param object $user Objet utilisateur contenant :
     *                    - full_name : Nom complet (requis)
     *                    - email : Adresse email (requis, unique)
     *                    - password : Mot de passe en clair (requis, sera hashé)
     *                    - role : Rôle de l'utilisateur (optionnel, défaut: 'client')
     *                    - is_active : Statut actif (optionnel, défaut: true)
     * @return void
     * @throws \Exception Si l'email existe déjà ou en cas d'erreur de base de données
     */
    public function add(object $user): void;
    
    /**
     * Met à jour les informations d'un utilisateur existant
     * 
     * @param object $user Objet utilisateur contenant :
     *                    - id : Identifiant de l'utilisateur à mettre à jour (requis)
     *                    - full_name : Nouveau nom complet (optionnel)
     *                    - email : Nouvelle adresse email (optionnel)
     *                    - password : Nouveau mot de passe (optionnel, sera hashé si fourni)
     *                    - role : Nouveau rôle (optionnel)
     *                    - is_active : Nouveau statut actif (optionnel)
     * @return bool true si la mise à jour a réussi, false sinon
     */
    public function update(object $user): bool;
    
    /**
     * Supprime un utilisateur de la base de données
     * 
     * ATTENTION : Cette opération est irréversible. 
     * Il est recommandé de désactiver le compte (is_active = false) plutôt que de le supprimer.
     * 
     * @param int $id Identifiant unique de l'utilisateur à supprimer
     * @return bool true si la suppression a réussi, false sinon
     */
    public function delete(int $id): bool;
}

