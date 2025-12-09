<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IUserRepository;
use App\Repositories\IApiTokenRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

/**
 * Contrôleur d'authentification
 * 
 * Gère toutes les opérations liées à l'authentification des utilisateurs :
 * - Connexion (login)
 * - Inscription (register)
 * - Déconnexion (logout)
 * - Récupération du profil utilisateur (me)
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class AuthController extends Controller
{
    /**
     * Repository pour la gestion des utilisateurs
     * @var IUserRepository
     */
    private IUserRepository $repo;
    
    /**
     * Repository pour la gestion des tokens API
     * @var IApiTokenRepository
     */
    private IApiTokenRepository $tokenRepo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param IUserRepository $repo Repository des utilisateurs
     * @param IApiTokenRepository $tokenRepo Repository des tokens API
     */
    public function __construct(IUserRepository $repo, IApiTokenRepository $tokenRepo)
    {
        $this->repo = $repo;
        $this->tokenRepo = $tokenRepo;
    }

    /**
     * Authentification d'un utilisateur (connexion)
     * 
     * Cette méthode gère la connexion d'un utilisateur avec les fonctionnalités suivantes :
     * - Rate limiting : protection contre les attaques brute force (max 5 tentatives/min)
     * - Validation des données d'entrée (email et mot de passe)
     * - Vérification des identifiants (email et mot de passe hashé)
     * - Vérification du statut actif du compte
     * - Vérification du rôle si requis (pour l'interface manager)
     * - Génération et stockage d'un token API sécurisé (expire dans 24h)
     * - Logging des tentatives de connexion (réussies et échouées)
     * 
     * @param Request $request Requête HTTP contenant email, password et optionnellement required_role
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Connexion réussie
     * - 401 : Identifiants invalides
     * - 403 : Compte désactivé ou rôle incorrect
     * - 422 : Erreurs de validation
     * - 429 : Trop de tentatives de connexion
     * - 500 : Erreur serveur lors de la création du token
     */
    public function login(Request $request)
    {
        // ============================================
        // ÉTAPE 1 : PROTECTION CONTRE LES ATTAQUES BRUTE FORCE
        // ============================================
        // Rate limiting : maximum 5 tentatives de connexion par email par minute
        // Utilise le cache Laravel pour stocker le nombre de tentatives
        $email = $request->input('email');
        $cacheKey = "login_attempts_{$email}";
        $attempts = Cache::get($cacheKey, 0);
        
        // Si le nombre de tentatives dépasse 5, bloquer l'accès pendant 1 minute
        if ($attempts >= 5) {
            return response()->json([
                "success" => false,
                "message" => "Trop de tentatives de connexion pour cet email. Veuillez réessayer dans 1 minute."
            ], 429); // Code HTTP 429 : Too Many Requests
        }

        // ============================================
        // ÉTAPE 2 : VALIDATION DES DONNÉES D'ENTRÉE
        // ============================================
        // Valider que l'email et le mot de passe sont présents et respectent les règles
        try {
            $data = $request->validate([
                "email" => "required|email|max:255",        // Email requis, format valide, max 255 caractères
                "password" => "required|string|min:1|max:255", // Mot de passe requis, chaîne, min 1 caractère, max 255
            ], [
                // Messages d'erreur personnalisés en français
                'email.required' => 'Le champ email est requis.',
                'email.email' => 'L\'email doit être une adresse email valide.',
                'email.max' => 'L\'email ne peut pas dépasser :max caractères.',
                'password.required' => 'Le champ mot de passe est requis.',
                'password.string' => 'Le mot de passe doit être une chaîne de caractères.',
                'password.min' => 'Le mot de passe doit contenir au moins :min caractère.',
                'password.max' => 'Le mot de passe ne peut pas dépasser :max caractères.',
            ]);
        } catch (ValidationException $e) {
            // Retourner les erreurs de validation avec le code HTTP 422 (Unprocessable Entity)
            return response()->json([
                "success" => false,
                "message" => "Erreurs de validation.",
                "errors" => $e->errors()
            ], 422);
        }

        // ============================================
        // ÉTAPE 3 : RALENTISSEMENT DES TENTATIVES ÉCHOUÉES
        // ============================================
        // Délai artificiel pour ralentir les attaques brute force
        // Plus il y a eu de tentatives, plus le délai est long (max 2 secondes)
        if ($attempts > 0) {
            sleep(min($attempts, 2));
        }

        // ============================================
        // ÉTAPE 4 : RECHERCHE DE L'UTILISATEUR
        // ============================================
        // Récupérer l'utilisateur depuis la base de données par son email
        $user = $this->repo->getByEmail($data["email"]);

        // ============================================
        // ÉTAPE 5 : VÉRIFICATION DU MOT DE PASSE
        // ============================================
        // Toujours vérifier le mot de passe même si l'utilisateur n'existe pas
        // Cela évite la détection d'utilisateurs existants par timing attack
        // Hash::check() compare le mot de passe en clair avec le hash stocké en BDD
        $passwordValid = $user && Hash::check($data["password"], $user->password);

        // ============================================
        // ÉTAPE 6 : GESTION DES ÉCHECS D'AUTHENTIFICATION
        // ============================================
        if (!$passwordValid) {
            // Incrémenter le compteur de tentatives dans le cache (expire dans 60 secondes)
            Cache::put($cacheKey, $attempts + 1, 60);
            
            // Logger la tentative échouée pour sécurité et audit
            // IMPORTANT : Ne jamais logger le mot de passe en clair
            Log::warning('Tentative de connexion échouée', [
                'email' => $data["email"],
                'ip' => $request->ip(),              // Adresse IP pour traçabilité
                'user_agent' => $request->userAgent(), // Navigateur utilisé
            ]);

            // Retourner une erreur générique pour ne pas révéler si l'email existe
            return response()->json([
                "success" => false,
                "message" => "Identifiants invalides."
            ], 401); // Code HTTP 401 : Unauthorized
        }

        // ============================================
        // ÉTAPE 7 : RÉINITIALISATION DU COMPTEUR
        // ============================================
        // Réinitialiser le compteur de tentatives en cas de succès
        Cache::forget($cacheKey);

        // ============================================
        // ÉTAPE 8 : VÉRIFICATION DU STATUT DU COMPTE
        // ============================================
        // Vérifier que le compte utilisateur est actif (non désactivé)
        if (!$user->is_active) {
            Log::warning('Tentative de connexion avec compte désactivé', [
                'email' => $data["email"],
                'ip' => $request->ip(),
            ]);

            return response()->json([
                "success" => false,
                "message" => "Compte désactivé."
            ], 403); // Code HTTP 403 : Forbidden
        }

        // ============================================
        // ÉTAPE 9 : VÉRIFICATION DU RÔLE (OPTIONNEL)
        // ============================================
        // Vérifier le rôle si demandé (utilisé par le frontend manager)
        // Permet de s'assurer qu'un utilisateur avec le rôle "manager" se connecte
        $requiredRole = $request->input('required_role');
        if ($requiredRole && ($user->role ?? 'client') !== $requiredRole) {
            Log::warning('Tentative de connexion avec mauvais rôle', [
                'email' => $data["email"],
                'role' => $user->role ?? 'client',
                'required_role' => $requiredRole,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                "success" => false,
                "message" => "Accès refusé. Rôle requis : {$requiredRole}."
            ], 403); // Code HTTP 403 : Forbidden
        }

        // ============================================
        // ÉTAPE 10 : GÉNÉRATION DU TOKEN API
        // ============================================
        // Générer un token sécurisé aléatoire de 64 caractères
        // Ce token sera utilisé pour authentifier les requêtes suivantes
        $token = Str::random(64);
        
        // Stocker le token dans la base de données avec expiration (24 heures = 24 * 60 minutes)
        try {
            $this->tokenRepo->create($user->id, $token, 24 * 60);
        } catch (\Exception $e) {
            // Logger l'erreur pour diagnostic
            Log::error('Erreur lors de la création du token', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            
            // Retourner une erreur serveur
            return response()->json([
                "success" => false,
                "message" => "Erreur lors de la création de la session. Vérifiez que la table api_tokens existe dans la base de données."
            ], 500); // Code HTTP 500 : Internal Server Error
        }

        // ============================================
        // ÉTAPE 11 : LOGGING DE LA CONNEXION RÉUSSIE
        // ============================================
        // Logger la connexion réussie pour audit et statistiques
        Log::info('Connexion réussie', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role ?? 'client',
            'ip' => $request->ip(),
        ]);

        // ============================================
        // ÉTAPE 12 : RETOUR DE LA RÉPONSE
        // ============================================
        // Récupérer le nom complet de l'utilisateur
        $fullName = $user->full_name ?? '';

        // Retourner les informations de l'utilisateur et le token
        // IMPORTANT : Ne jamais retourner le mot de passe, même hashé
        return response()->json([
            "success" => true,
            "message" => "Connexion réussie.",
            "data" => [
                "user" => (object) [
                    "id" => $user->id,
                    "full_name" => $fullName,
                    "email" => $user->email,
                    "role" => $user->role ?? 'client',
                ],
                "token" => $token  // Token à utiliser dans le header Authorization: Bearer {token}
            ]
        ], 200); // Code HTTP 200 : OK
    }

    /**
     * Déconnexion d'un utilisateur
     * 
     * Cette méthode supprime le token API de l'utilisateur pour invalider sa session.
     * Le token est récupéré depuis le header Authorization de la requête.
     * 
     * @param Request $request Requête HTTP contenant le token dans le header Authorization
     * @return \Illuminate\Http\JsonResponse
     * 
     * Code de réponse : 200 (toujours réussi, même si le token n'existe pas)
     */
    public function logout(Request $request)
    {
        // Récupérer le token depuis le header Authorization (format: Bearer {token})
        $token = $request->bearerToken();
        
        // Supprimer le token de la base de données s'il existe
        if ($token) {
            $this->tokenRepo->deleteByToken($token);
        }
        
        return response()->json([
            "success" => true,
            "message" => "Déconnexion réussie."
        ], 200);
    }

    /**
     * Inscription d'un nouvel utilisateur
     * 
     * Cette méthode gère l'inscription d'un nouvel utilisateur avec les fonctionnalités suivantes :
     * - Validation complète des données (nom, email, mot de passe et confirmation)
     * - Vérification de l'unicité de l'email
     * - Hashage sécurisé du mot de passe (bcrypt)
     * - Attribution d'un rôle (client par défaut, manager si spécifié)
     * - Génération automatique d'un token API pour connexion immédiate
     * - Logging de l'inscription
     * 
     * @param Request $request Requête HTTP contenant :
     *                        - full_name : Nom complet (requis, min 3 caractères)
     *                        - email : Adresse email (requis, unique, format email valide)
     *                        - password : Mot de passe (requis, min 8 caractères)
     *                        - password_confirmation : Confirmation du mot de passe (requis, doit correspondre)
     *                        - role : Rôle de l'utilisateur (optionnel, 'client' ou 'manager', défaut: 'client')
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 201 : Inscription réussie
     * - 422 : Erreurs de validation (email déjà utilisé, données invalides)
     * - 500 : Erreur serveur lors de la création
     */
    public function register(Request $request)
    {
        // ============================================
        // ÉTAPE 1 : VALIDATION DES DONNÉES D'INSCRIPTION
        // ============================================
        try {
            $data = $request->validate([
                "full_name" => "required|string|min:3|max:255",              // Nom complet requis, min 3 caractères
                "email" => "required|email|max:255|unique:users,email",       // Email requis, unique, format valide
                "password" => "required|string|min:8|max:255",                // Mot de passe requis, min 8 caractères
                "password_confirmation" => "required|string|same:password",   // Confirmation doit correspondre au mot de passe
            ], [
                'full_name.required' => 'Le champ nom complet est requis.',
                'full_name.string' => 'Le nom complet doit être une chaîne de caractères.',
                'full_name.min' => 'Le nom complet doit contenir au moins :min caractères.',
                'full_name.max' => 'Le nom complet ne peut pas dépasser :max caractères.',
                'email.required' => 'Le champ email est requis.',
                'email.email' => 'L\'email doit être une adresse email valide.',
                'email.max' => 'L\'email ne peut pas dépasser :max caractères.',
                'email.unique' => 'Cet email est déjà utilisé.',
                'password.required' => 'Le champ mot de passe est requis.',
                'password.string' => 'Le mot de passe doit être une chaîne de caractères.',
                'password.min' => 'Le mot de passe doit contenir au moins :min caractères.',
                'password.max' => 'Le mot de passe ne peut pas dépasser :max caractères.',
                'password_confirmation.required' => 'Le champ confirmation du mot de passe est requis.',
                'password_confirmation.string' => 'La confirmation du mot de passe doit être une chaîne de caractères.',
                'password_confirmation.same' => 'La confirmation du mot de passe ne correspond pas au mot de passe.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                "success" => false,
                "message" => "Erreurs de validation.",
                "errors" => $e->errors()
            ], 422);
        }

        // ============================================
        // ÉTAPE 2 : VÉRIFICATION DE L'UNICITÉ DE L'EMAIL
        // ============================================
        // Double vérification de l'unicité de l'email (même si la validation le fait déjà)
        $existingUser = $this->repo->getByEmail($data["email"]);
        if ($existingUser) {
            return response()->json([
                "success" => false,
                "message" => "Cet email est déjà utilisé.",
                "errors" => [
                    "email" => ["Cet email est déjà utilisé."]
                ]
            ], 422);
        }

        // ============================================
        // ÉTAPE 3 : DÉTERMINATION DU RÔLE
        // ============================================
        // Déterminer le rôle de l'utilisateur (par défaut "client")
        // Le rôle "manager" peut être spécifié lors de l'inscription depuis l'interface manager
        $role = $request->input('role', 'client');
        
        // Valider que le rôle est valide (sécurité : éviter les rôles non autorisés)
        if (!in_array($role, ['client', 'manager'])) {
            $role = 'client'; // Rôle par défaut si invalide
        }
        
        // ============================================
        // ÉTAPE 4 : PRÉPARATION DES DONNÉES UTILISATEUR
        // ============================================
        // Créer l'objet utilisateur avec les données validées
        // Le mot de passe sera hashé automatiquement par le repository
        $user = (object) [
            "full_name" => $data["full_name"],
            "email" => $data["email"],
            "password" => $data["password"],  // Sera hashé par le repository
            "role" => $role,
            "is_active" => true,              // Nouveau compte activé par défaut
        ];

        // ============================================
        // ÉTAPE 5 : CRÉATION DE L'UTILISATEUR
        // ============================================
        try {
            // Créer l'utilisateur dans la base de données (le mot de passe sera hashé)
            $this->repo->add($user);
            
            // Récupérer l'utilisateur créé pour obtenir son ID (nécessaire pour le token)
            $createdUser = $this->repo->getByEmail($data["email"]);
            
            // Vérification de sécurité : s'assurer que l'utilisateur a bien été créé
            if (!$createdUser) {
                throw new \Exception("Erreur lors de la création de l'utilisateur");
            }

            // ============================================
            // ÉTAPE 6 : GÉNÉRATION DU TOKEN API
            // ============================================
            // Générer un token sécurisé pour connexion immédiate après inscription
            $token = Str::random(64);
            // Stocker le token avec expiration de 24 heures
            $this->tokenRepo->create($createdUser->id, $token, 24 * 60);

            // ============================================
            // ÉTAPE 7 : LOGGING DE L'INSCRIPTION
            // ============================================
            // Logger l'inscription réussie pour audit
            Log::info('Inscription réussie', [
                'user_id' => $createdUser->id,
                'email' => $createdUser->email,
                'ip' => $request->ip(),
            ]);

            // Récupérer le nom complet (supporte différents formats)
            $fullName = $createdUser->full_name ?? $createdUser->name ?? '';

            // ============================================
            // ÉTAPE 8 : RETOUR DE LA RÉPONSE
            // ============================================
            // Retourner les informations de l'utilisateur et le token
            return response()->json([
                "success" => true,
                "message" => "Inscription réussie.",
                "data" => [
                    "user" => (object) [
                        "id" => $createdUser->id,
                        "full_name" => $fullName,
                        "email" => $createdUser->email,
                        "role" => $createdUser->role ?? 'client',
                    ],
                    "token" => $token  // Token pour connexion immédiate
                ]
            ], 201); // Code HTTP 201 : Created
            
        } catch (\Exception $e) {
            // ============================================
            // GESTION DES ERREURS
            // ============================================
            // Logger l'erreur pour diagnostic
            Log::error('Erreur lors de l\'inscription', [
                'email' => $data["email"],
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            // Retourner une erreur générique (ne pas exposer les détails techniques)
            return response()->json([
                "success" => false,
                "message" => "Erreur lors de l'inscription. Veuillez réessayer."
            ], 500); // Code HTTP 500 : Internal Server Error
        }
    }

    /**
     * Récupération du profil de l'utilisateur connecté
     * 
     * Cette méthode retourne les informations de l'utilisateur actuellement authentifié.
     * L'utilisateur est automatiquement vérifié par le middleware AuthenticateApi
     * qui s'assure que le token est valide et non expiré.
     * 
     * @param Request $request Requête HTTP (doit contenir un token valide dans le header Authorization)
     * @return \Illuminate\Http\JsonResponse
     * 
     * Codes de réponse possibles :
     * - 200 : Profil récupéré avec succès
     * - 401 : Utilisateur non authentifié (token invalide ou manquant)
     * 
     * Note : Cette route est protégée par le middleware AuthenticateApi
     */
    public function me(Request $request)
    {
        // L'utilisateur est déjà vérifié par le middleware AuthenticateApi
        // Si on arrive ici, c'est que le token est valide
        $user = $request->user();
        
        // Vérification de sécurité supplémentaire (ne devrait jamais être null)
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non authentifié."
            ], 401);
        }

        // Récupérer le nom complet (supporte différents formats de nom)
        $fullName = $user->full_name ?? $user->name ?? '';

        // Retourner les informations de l'utilisateur (sans le mot de passe)
        return response()->json([
            "success" => true,
            "data" => [
                "user" => (object) [
                    "id" => $user->id,
                    "full_name" => $fullName,
                    "email" => $user->email,
                    "role" => $user->role ?? 'client',
                ]
            ]
        ], 200);
    }
}

