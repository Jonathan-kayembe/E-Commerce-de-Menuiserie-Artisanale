<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Repositories\IApiTokenRepository;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApi
{
    private IApiTokenRepository $tokenRepo;

    public function __construct(IApiTokenRepository $tokenRepo)
    {
        $this->tokenRepo = $tokenRepo;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ?string $role = null): Response
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                "success" => false,
                "message" => "Token d'authentification manquant."
            ], 401);
        }

        // Vérifier le token dans la base de données
        $apiToken = $this->tokenRepo->findByToken($token);
        
        if (!$apiToken) {
            return response()->json([
                "success" => false,
                "message" => "Token invalide ou expiré."
            ], 401);
        }

        // Récupérer l'utilisateur
        $user = app(\App\Repositories\IUserRepository::class)->getById($apiToken->user_id);
        
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404);
        }

        // Vérifier si le compte est actif
        if (!$user->is_active) {
            return response()->json([
                "success" => false,
                "message" => "Compte désactivé."
            ], 403);
        }

        // Vérifier le rôle si spécifié
        if ($role && ($user->role ?? 'client') !== $role) {
            return response()->json([
                "success" => false,
                "message" => "Accès refusé. Rôle requis : {$role}."
            ], 403);
        }

        // Ajouter l'utilisateur à la requête pour utilisation dans les contrôleurs
        // Utiliser setUserResolver au lieu de merge pour éviter l'erreur InputBag::set()
        // Ne pas merger l'objet stdClass directement dans la requête
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}

