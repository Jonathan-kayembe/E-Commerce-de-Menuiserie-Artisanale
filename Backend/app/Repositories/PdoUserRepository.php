<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Implémentation PDO du repository des utilisateurs
 * 
 * Cette classe implémente IUserRepository en utilisant PDO pour l'accès à la base de données.
 * Elle gère toutes les opérations CRUD sur la table 'users'.
 * 
 * Caractéristiques :
 * - Utilise PDO avec des requêtes préparées (protection contre les injections SQL)
 * - Hashage automatique des mots de passe avec bcrypt (via Hash::make())
 * - Ne retourne jamais les mots de passe dans les résultats (sécurité)
 * - Gestion des valeurs par défaut (role: 'client', is_active: true)
 * 
 * @package App\Repositories
 * @author Jonathan Kayembe
 */
class PdoUserRepository implements IUserRepository
{
    /**
     * Connexion PDO à la base de données
     * @var PDO
     */
    private PDO $pdo;

    /**
     * Constructeur
     * 
     * Initialise la connexion PDO en utilisant la connexion Laravel configurée.
     */
    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    /**
     * Récupère tous les utilisateurs
     * 
     * IMPORTANT : Ne retourne pas le mot de passe pour des raisons de sécurité.
     * Les utilisateurs sont triés par date de création décroissante (plus récents en premier).
     * 
     * @return array<int, object> Tableau d'objets utilisateurs
     */
    public function getAll(): array
    {
        // Requête SQL : sélectionne tous les champs sauf le mot de passe
        // COALESCE() assure des valeurs par défaut si NULL (role: 'client', is_active: 1)
        $stmt = $this->pdo->query("SELECT id, full_name, email, COALESCE(role, 'client') as role, COALESCE(is_active, 1) as is_active, created_at, updated_at FROM users ORDER BY created_at DESC");
        // Retourne un tableau d'objets (stdClass) au lieu d'un tableau associatif
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Récupère un utilisateur par son identifiant
     * 
     * @param int $id Identifiant unique de l'utilisateur
     * @return object|null Objet utilisateur ou null si non trouvé
     */
    public function getById(int $id): ?object
    {
        // Requête préparée pour éviter les injections SQL
        $stmt = $this->pdo->prepare("SELECT id, full_name, email, COALESCE(role, 'client') as role, COALESCE(is_active, 1) as is_active, created_at, updated_at FROM users WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT); // Liaison sécurisée du paramètre
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_OBJ);
        return $user ?: null; // Retourne null si aucun résultat
    }

    /**
     * Récupère un utilisateur par son adresse email
     * 
     * Cette méthode retourne TOUS les champs, y compris le mot de passe hashé.
     * Utilisée uniquement pour l'authentification où le mot de passe est nécessaire.
     * 
     * @param string $email Adresse email de l'utilisateur
     * @return object|null Objet utilisateur (avec mot de passe hashé) ou null si non trouvé
     */
    public function getByEmail(string $email): ?object
    {
        // Requête préparée : SELECT * pour obtenir tous les champs (y compris password pour vérification)
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email=:email");
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_OBJ);
        return $user ?: null;
    }

    /**
     * Ajoute un nouvel utilisateur dans la base de données
     * 
     * Le mot de passe est automatiquement hashé avec bcrypt avant l'insertion.
     * Les valeurs par défaut sont appliquées si non spécifiées (role: 'client', is_active: true).
     * 
     * @param object $user Objet utilisateur avec les propriétés requises
     * @return void
     * @throws \PDOException Si l'email existe déjà (contrainte unique) ou erreur de base de données
     */
    public function add(object $user): void
    {
        // Requête préparée INSERT avec tous les champs nécessaires
        $stmt = $this->pdo->prepare("INSERT INTO users (full_name, email, password, role, is_active)
                       VALUES (:fullName, :email, :password, :role, :isActive)");
        
        // Liaison des paramètres avec leurs types appropriés
        $stmt->bindValue(':fullName', $user->full_name, PDO::PARAM_STR);
        $stmt->bindValue(':email', $user->email, PDO::PARAM_STR);
        
        // IMPORTANT : Hashage du mot de passe avec bcrypt (algorithme sécurisé)
        // Le mot de passe en clair n'est jamais stocké en base de données
        $stmt->bindValue(':password', Hash::make($user->password), PDO::PARAM_STR);
        
        // Valeurs par défaut si non spécifiées
        $stmt->bindValue(':role', $user->role ?? 'client', PDO::PARAM_STR);
        $stmt->bindValue(':isActive', $user->is_active ?? true, PDO::PARAM_BOOL);
        
        $stmt->execute();
    }

    /**
     * Met à jour les informations d'un utilisateur existant
     * 
     * Cette méthode permet de mettre à jour partiellement un utilisateur.
     * Le mot de passe n'est mis à jour que s'il est fourni dans l'objet $user.
     * 
     * @param object $user Objet utilisateur avec au minimum l'id
     * @return bool true si la mise à jour a réussi, false sinon
     */
    public function update(object $user): bool
    {
        // Construction dynamique de la requête SQL selon les champs à mettre à jour
        $sql = "UPDATE users SET full_name=:fullName, email=:email, role=:role, is_active=:isActive";
        $params = [
            ':id' => $user->id,
            ':fullName' => $user->full_name,
            ':email' => $user->email,
            ':role' => $user->role,
            ':isActive' => $user->is_active ?? true,
        ];

        // Ajouter le mot de passe à la requête seulement s'il est fourni
        // Cela permet de mettre à jour les autres champs sans changer le mot de passe
        if (isset($user->password) && $user->password) {
            $sql .= ", password=:password";
            // Hashage du nouveau mot de passe
            $params[':password'] = Hash::make($user->password);
        }

        $sql .= " WHERE id=:id";

        // Préparation et exécution de la requête
        $stmt = $this->pdo->prepare($sql);
        foreach ($params as $key => $value) {
            // Détermination du type PDO selon le paramètre
            $type = $key === ':id' ? PDO::PARAM_INT : ($key === ':isActive' ? PDO::PARAM_BOOL : PDO::PARAM_STR);
            $stmt->bindValue($key, $value, $type);
        }
        return $stmt->execute();
    }

    /**
     * Supprime un utilisateur de la base de données
     * 
     * ATTENTION : Cette opération est irréversible et supprime définitivement l'utilisateur.
     * Il est recommandé de désactiver le compte (is_active = false) plutôt que de le supprimer.
     * 
     * @param int $id Identifiant unique de l'utilisateur à supprimer
     * @return bool true si la suppression a réussi, false sinon
     */
    public function delete(int $id): bool
    {
        // Requête préparée DELETE
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id=:id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

