<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

/**
 * Implémentation PDO du repository des tokens API
 * 
 * Cette classe implémente IApiTokenRepository en utilisant PDO pour l'accès à la base de données.
 * Elle gère toutes les opérations sur la table 'api_tokens'.
 * 
 * Caractéristiques :
 * - Utilise PDO avec des requêtes préparées (protection contre les injections SQL)
 * - Gestion automatique de l'expiration des tokens
 * - Suppression automatique des anciens tokens lors de la création d'un nouveau
 * - Logging des opérations pour audit et débogage
 * 
 * @package App\Repositories
 * @author Jonathan Kayembe
 */
class PdoApiTokenRepository implements IApiTokenRepository
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
     * Crée un nouveau token API pour un utilisateur
     * 
     * Cette méthode supprime automatiquement tous les anciens tokens de l'utilisateur
     * pour garantir qu'un seul token est actif à la fois (sécurité renforcée).
     * 
     * @param int $userId Identifiant de l'utilisateur propriétaire du token
     * @param string $token Token sécurisé (généralement 64 caractères aléatoires)
     * @param int|null $expiresInMinutes Durée de vie du token en minutes (null = pas d'expiration)
     * @return void
     * @throws \Exception Si la création échoue (ex: erreur de base de données)
     */
    public function create(int $userId, string $token, ?int $expiresInMinutes = null): void
    {
        try {
            // Calcul de la date d'expiration si spécifiée
            // Format MySQL datetime : 'YYYY-MM-DD HH:MM:SS'
            $expiresAt = $expiresInMinutes ? date('Y-m-d H:i:s', strtotime("+{$expiresInMinutes} minutes")) : null;
            
            // ============================================
            // SÉCURITÉ : Suppression des anciens tokens
            // ============================================
            // Supprimer tous les anciens tokens de l'utilisateur
            // Garantit qu'un seul token est actif à la fois (évite les tokens multiples)
            $this->deleteByUserId($userId);
            
            // Insertion du nouveau token dans la base de données
            $stmt = $this->pdo->prepare("INSERT INTO api_tokens (user_id, token, expires_at) 
                           VALUES (:userId, :token, :expiresAt)");
            $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':token', $token, PDO::PARAM_STR);
            $stmt->bindValue(':expiresAt', $expiresAt, PDO::PARAM_STR);
            $stmt->execute();
            
            // Logger pour audit et débogage (sans exposer le token complet)
            \Log::info('Token créé avec succès', [
                'user_id' => $userId,
                'token_preview' => substr($token, 0, 10) . '...', // Aperçu sécurisé
                'expires_at' => $expiresAt,
            ]);
        } catch (\PDOException $e) {
            // Logger l'erreur pour diagnostic
            \Log::error('Erreur lors de la création du token', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);
            
            // Relancer l'exception pour que le contrôleur puisse la gérer
            // Permet d'afficher un message d'erreur approprié à l'utilisateur
            throw new \Exception('Erreur lors de la création du token: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Recherche un token dans la base de données
     * 
     * Vérifie automatiquement que le token n'est pas expiré en comparant expires_at avec NOW().
     * Si expires_at est NULL, le token n'expire jamais.
     * 
     * @param string $token Token à rechercher
     * @return object|null Objet token contenant user_id, token, expires_at, ou null si non trouvé/expiré
     */
    public function findByToken(string $token): ?object
    {
        try {
            // Requête SQL avec vérification d'expiration automatique
            // expires_at IS NULL : token sans expiration
            // expires_at > NOW() : token non expiré
            $stmt = $this->pdo->prepare("SELECT * FROM api_tokens WHERE token=:token AND (expires_at IS NULL OR expires_at > NOW())");
            $stmt->bindValue(':token', $token, PDO::PARAM_STR);
            $stmt->execute();
            $apiToken = $stmt->fetch(PDO::FETCH_OBJ);
            
            // Logger les tentatives d'accès avec token invalide/expiré (sécurité)
            if (!$apiToken) {
                \Log::warning('Token non trouvé ou expiré', [
                    'token_preview' => substr($token, 0, 10) . '...', // Aperçu sécurisé
                ]);
            }
            
            return $apiToken ?: null;
        } catch (\PDOException $e) {
            // Logger l'erreur pour diagnostic
            \Log::error('Erreur lors de la recherche du token', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);
            return null; // Retourner null en cas d'erreur plutôt que de lever une exception
        }
    }

    /**
     * Supprime un token spécifique de la base de données
     * 
     * Utilisé lors de la déconnexion d'un utilisateur pour invalider son token.
     * 
     * @param string $token Token à supprimer
     * @return bool true si la suppression a réussi, false sinon
     */
    public function deleteByToken(string $token): bool
    {
        try {
            // Requête préparée DELETE
            $stmt = $this->pdo->prepare("DELETE FROM api_tokens WHERE token=:token");
            $stmt->bindValue(':token', $token, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (\PDOException $e) {
            // En cas d'erreur, retourner false plutôt que de lever une exception
            // Permet au contrôleur de gérer l'erreur gracieusement
            return false;
        }
    }

    /**
     * Supprime tous les tokens d'un utilisateur
     * 
     * Utilisé lors de :
     * - La création d'un nouveau token (pour garantir l'unicité)
     * - La suppression d'un compte utilisateur
     * - La déconnexion forcée de tous les appareils
     * 
     * @param int $userId Identifiant de l'utilisateur dont les tokens doivent être supprimés
     * @return bool true si la suppression a réussi, false sinon
     */
    public function deleteByUserId(int $userId): bool
    {
        try {
            // Requête préparée DELETE pour supprimer tous les tokens d'un utilisateur
            $stmt = $this->pdo->prepare("DELETE FROM api_tokens WHERE user_id=:userId");
            $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (\PDOException $e) {
            // En cas d'erreur, retourner false plutôt que de lever une exception
            return false;
        }
    }
}

