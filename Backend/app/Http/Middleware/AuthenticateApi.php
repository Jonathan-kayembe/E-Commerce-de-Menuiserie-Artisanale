<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Repositories\IApiTokenRepository;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware d'authentification API
 * 
 * Ce middleware protège les routes API en vérifiant la validité des tokens d'authentification.
 * Il s'exécute avant que la requête n'atteigne le contrôleur et effectue les vérifications suivantes :
 * 
 * 1. Vérifie la présence du token dans le header Authorization (format Bearer)
 * 2. Valide le token dans la base de données (existence et expiration)
 * 3. Récupère l'utilisateur associé au token
 * 4. Vérifie que le compte utilisateur est actif
 * 5. Vérifie le rôle de l'utilisateur si un rôle spécifique est requis
 * 6. Attache l'utilisateur à la requête pour utilisation dans les contrôleurs
 * 
 * @package App\Http\Middleware
 * @author Jonathan Kayembe
 */
class AuthenticateApi
{
    /**
     * Repository pour la gestion des tokens API
     * @var IApiTokenRepository
     */
    private IApiTokenRepository $tokenRepo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param IApiTokenRepository $tokenRepo Repository des tokens API
     */
    public function __construct(IApiTokenRepository $tokenRepo)
    {
        $this->tokenRepo = $tokenRepo;
    }

    /**
     * Gère une requête entrante et vérifie l'authentification
     * 
     * Cette méthode est appelée automatiquement par Laravel pour chaque requête
     * passant par ce middleware. Elle effectue toutes les vérifications nécessaires
     * avant de permettre à la requête de continuer vers le contrôleur.
     * 
     * @param Request $request La requête HTTP entrante
     * @param Closure $next La prochaine étape du pipeline de middleware
     * @param string|null $role Rôle optionnel requis pour accéder à la route (ex: 'manager')
     * @return Response Réponse JSON en cas d'erreur, ou passage à la suite du pipeline
     * 
     * Codes de réponse possibles :
     * - 401 : Token manquant, invalide ou expiré
     * - 403 : Compte désactivé ou rôle insuffisant
     * - 404 : Utilisateur non trouvé
     * - Continue : Si toutes les vérifications passent
     */
    public function handle(Request $request, Closure $next, ?string $role = null): Response
    {
        // ============================================
        // ÉTAPE 1 : RÉCUPÉRATION DU TOKEN
        // ============================================
        // Extraire le token depuis le header Authorization (format: "Bearer {token}")
        $token = $request->bearerToken();
        
        // Vérifier que le token est présent
        if (!$token) {
            return response()->json([
                "success" => false,
                "message" => "Token d'authentification manquant."
            ], 401); // Code HTTP 401 : Unauthorized
        }

        // ============================================
        // ÉTAPE 2 : VALIDATION DU TOKEN
        // ============================================
        // Vérifier que le token existe dans la base de données et n'est pas expiré
        // Le repository vérifie automatiquement la date d'expiration
        $apiToken = $this->tokenRepo->findByToken($token);
        
        if (!$apiToken) {
            return response()->json([
                "success" => false,
                "message" => "Token invalide ou expiré."
            ], 401); // Code HTTP 401 : Unauthorized
        }

        // ============================================
        // ÉTAPE 3 : RÉCUPÉRATION DE L'UTILISATEUR
        // ============================================
        // Récupérer l'utilisateur associé au token depuis la base de données
        // Utilisation du service container Laravel pour résoudre le repository
        $user = app(\App\Repositories\IUserRepository::class)->getById($apiToken->user_id);
        
        // Vérifier que l'utilisateur existe (sécurité : token orphelin)
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non trouvé."
            ], 404); // Code HTTP 404 : Not Found
        }

        // ============================================
        // ÉTAPE 4 : VÉRIFICATION DU STATUT DU COMPTE
        // ============================================
        // Vérifier que le compte utilisateur est actif (non désactivé)
        // Permet de désactiver un compte sans supprimer les tokens
        if (!$user->is_active) {
            return response()->json([
                "success" => false,
                "message" => "Compte désactivé."
            ], 403); // Code HTTP 403 : Forbidden
        }

        // ============================================
        // ÉTAPE 5 : VÉRIFICATION DU RÔLE (OPTIONNEL)
        // ============================================
        // Si un rôle spécifique est requis pour la route (ex: 'manager'),
        // vérifier que l'utilisateur possède ce rôle
        // Utilisé pour protéger les routes d'administration
        if ($role && ($user->role ?? 'client') !== $role) {
            return response()->json([
                "success" => false,
                "message" => "Accès refusé. Rôle requis : {$role}."
            ], 403); // Code HTTP 403 : Forbidden
        }

        // ============================================
        // ÉTAPE 6 : ATTACHEMENT DE L'UTILISATEUR À LA REQUÊTE
        // ============================================
        // Ajouter l'utilisateur authentifié à la requête pour utilisation dans les contrôleurs
        // Utiliser setUserResolver() au lieu de merge() pour éviter l'erreur InputBag::set()
        // Cette méthode permet d'accéder à l'utilisateur via $request->user() dans les contrôleurs
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        // ============================================
        // ÉTAPE 7 : PASSAGE À LA SUITE DU PIPELINE
        // ============================================
        // Toutes les vérifications sont passées, continuer vers le contrôleur
        return $next($request);
    }
}

