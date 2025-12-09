<?php

namespace App\Repositories;

/**
 * Interface du repository des tokens API
 * 
 * Définit le contrat pour toutes les opérations sur les tokens d'authentification API.
 * Les tokens sont utilisés pour authentifier les requêtes API et remplacer les sessions traditionnelles.
 * 
 * Caractéristiques des tokens :
 * - Générés de manière aléatoire et sécurisée (64 caractères)
 * - Stockés dans la base de données avec une date d'expiration
 * - Associés à un utilisateur spécifique
 * - Un utilisateur ne peut avoir qu'un seul token actif à la fois
 * 
 * @package App\Repositories
 * @author Jonathan Kayembe
 */
interface IApiTokenRepository {
    /**
     * Crée un nouveau token API pour un utilisateur
     * 
     * Cette méthode supprime automatiquement les anciens tokens de l'utilisateur
     * pour garantir qu'un seul token est actif à la fois (sécurité).
     * 
     * @param int $userId Identifiant de l'utilisateur propriétaire du token
     * @param string $token Token sécurisé (généralement 64 caractères aléatoires)
     * @param int|null $expiresInMinutes Durée de vie du token en minutes (null = pas d'expiration)
     * @return void
     * @throws \Exception Si la création échoue (ex: erreur de base de données)
     */
    public function create(int $userId, string $token, ?int $expiresInMinutes = null): void;
    
    /**
     * Recherche un token dans la base de données
     * 
     * Vérifie automatiquement que le token n'est pas expiré.
     * Si expires_at est NULL, le token n'expire jamais.
     * 
     * @param string $token Token à rechercher
     * @return object|null Objet token contenant user_id, token, expires_at, ou null si non trouvé/expiré
     */
    public function findByToken(string $token): ?object;
    
    /**
     * Supprime un token spécifique de la base de données
     * 
     * Utilisé lors de la déconnexion d'un utilisateur.
     * 
     * @param string $token Token à supprimer
     * @return bool true si la suppression a réussi, false sinon
     */
    public function deleteByToken(string $token): bool;
    
    /**
     * Supprime tous les tokens d'un utilisateur
     * 
     * Utilisé lors de la création d'un nouveau token (pour garantir l'unicité)
     * ou lors de la suppression d'un compte utilisateur.
     * 
     * @param int $userId Identifiant de l'utilisateur dont les tokens doivent être supprimés
     * @return bool true si la suppression a réussi, false sinon
     */
    public function deleteByUserId(int $userId): bool;
}

