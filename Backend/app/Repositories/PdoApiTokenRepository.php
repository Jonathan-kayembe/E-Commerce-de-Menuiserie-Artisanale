<?php

namespace App\Repositories;

use PDO;
use Illuminate\Support\Facades\DB;

class PdoApiTokenRepository implements IApiTokenRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = DB::connection()->getPdo();
    }

    public function create(int $userId, string $token, ?int $expiresInMinutes = null): void
    {
        try {
            $expiresAt = $expiresInMinutes ? date('Y-m-d H:i:s', strtotime("+{$expiresInMinutes} minutes")) : null;
            
            // Supprimer les anciens tokens de l'utilisateur
            $this->deleteByUserId($userId);
            
            $stmt = $this->pdo->prepare("INSERT INTO api_tokens (user_id, token, expires_at) 
                           VALUES (:userId, :token, :expiresAt)");
            $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':token', $token, PDO::PARAM_STR);
            $stmt->bindValue(':expiresAt', $expiresAt, PDO::PARAM_STR);
            $stmt->execute();
            
            // Logger pour débogage
            \Log::info('Token créé avec succès', [
                'user_id' => $userId,
                'token_preview' => substr($token, 0, 10) . '...',
                'expires_at' => $expiresAt,
            ]);
        } catch (\PDOException $e) {
            // Logger l'erreur au lieu de l'ignorer silencieusement
            \Log::error('Erreur lors de la création du token', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);
            
            // Relancer l'exception pour que le contrôleur puisse la gérer
            throw new \Exception('Erreur lors de la création du token: ' . $e->getMessage(), 0, $e);
        }
    }

    public function findByToken(string $token): ?object
    {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM api_tokens WHERE token=:token AND (expires_at IS NULL OR expires_at > NOW())");
            $stmt->bindValue(':token', $token, PDO::PARAM_STR);
            $stmt->execute();
            $apiToken = $stmt->fetch(PDO::FETCH_OBJ);
            
            if (!$apiToken) {
                \Log::warning('Token non trouvé ou expiré', [
                    'token_preview' => substr($token, 0, 10) . '...',
                ]);
            }
            
            return $apiToken ?: null;
        } catch (\PDOException $e) {
            \Log::error('Erreur lors de la recherche du token', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);
            return null;
        }
    }

    public function deleteByToken(string $token): bool
    {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM api_tokens WHERE token=:token");
            $stmt->bindValue(':token', $token, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function deleteByUserId(int $userId): bool
    {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM api_tokens WHERE user_id=:userId");
            $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }
}

