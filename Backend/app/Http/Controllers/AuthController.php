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

class AuthController extends Controller
{
    private IUserRepository $repo;
    private IApiTokenRepository $tokenRepo;

    public function __construct(IUserRepository $repo, IApiTokenRepository $tokenRepo)
    {
        $this->repo = $repo;
        $this->tokenRepo = $tokenRepo;
    }

    // LOGIN — authentification
    public function login(Request $request)
    {
        // Rate limiting : max 5 tentatives par email par minute
        $email = $request->input('email');
        $cacheKey = "login_attempts_{$email}";
        $attempts = Cache::get($cacheKey, 0);
        
        if ($attempts >= 5) {
            return response()->json([
                "success" => false,
                "message" => "Trop de tentatives de connexion pour cet email. Veuillez réessayer dans 1 minute."
            ], 429);
        }

        try {
            $data = $request->validate([
                "email" => "required|email|max:255",
                "password" => "required|string|min:1|max:255",
            ], [
                'email.required' => 'Le champ email est requis.',
                'email.email' => 'L\'email doit être une adresse email valide.',
                'email.max' => 'L\'email ne peut pas dépasser :max caractères.',
                'password.required' => 'Le champ mot de passe est requis.',
                'password.string' => 'Le mot de passe doit être une chaîne de caractères.',
                'password.min' => 'Le mot de passe doit contenir au moins :min caractère.',
                'password.max' => 'Le mot de passe ne peut pas dépasser :max caractères.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                "success" => false,
                "message" => "Erreurs de validation.",
                "errors" => $e->errors()
            ], 422);
        }

        // Délai artificiel pour ralentir les attaques brute force (1-2 secondes)
        if ($attempts > 0) {
            sleep(min($attempts, 2));
        }

        $user = $this->repo->getByEmail($data["email"]);

        // Toujours vérifier le mot de passe même si l'utilisateur n'existe pas
        // pour éviter la détection d'utilisateurs existants
        $passwordValid = $user && Hash::check($data["password"], $user->password);

        if (!$passwordValid) {
            // Incrémenter le compteur de tentatives
            Cache::put($cacheKey, $attempts + 1, 60); // 60 secondes
            
            // Logger la tentative échouée (sans le mot de passe)
            Log::warning('Tentative de connexion échouée', [
                'email' => $data["email"],
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                "success" => false,
                "message" => "Identifiants invalides."
            ], 401);
        }

        // Réinitialiser le compteur en cas de succès
        Cache::forget($cacheKey);

        if (!$user->is_active) {
            Log::warning('Tentative de connexion avec compte désactivé', [
                'email' => $data["email"],
                'ip' => $request->ip(),
            ]);

            return response()->json([
                "success" => false,
                "message" => "Compte désactivé."
            ], 403);
        }

        // Vérifier le rôle si demandé (pour le frontend manager)
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
            ], 403);
        }

        // Générer un token sécurisé (64 caractères alphanumériques)
        $token = Str::random(64);
        
        // Stocker le token dans la base de données (expire dans 24h)
        try {
            $this->tokenRepo->create($user->id, $token, 24 * 60);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du token', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                "success" => false,
                "message" => "Erreur lors de la création de la session. Vérifiez que la table api_tokens existe dans la base de données."
            ], 500);
        }

        // Logger la connexion réussie
        Log::info('Connexion réussie', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role ?? 'client',
            'ip' => $request->ip(),
        ]);

        // Récupérer le nom complet
        $fullName = $user->full_name ?? '';

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
                "token" => $token
            ]
        ], 200);
    }

    // LOGOUT — déconnexion
    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            $this->tokenRepo->deleteByToken($token);
        }
        return response()->json([
            "success" => true,
            "message" => "Déconnexion réussie."
        ], 200);
    }

    // REGISTER — inscription d'un nouvel utilisateur
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                "full_name" => "required|string|min:3|max:255",
                "email" => "required|email|max:255|unique:users,email",
                "password" => "required|string|min:8|max:255",
                "password_confirmation" => "required|string|same:password",
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

        // Vérifier si l'email existe déjà
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

        // Déterminer le rôle (par défaut "client", peut être "manager" si spécifié)
        $role = $request->input('role', 'client');
        
        // Valider que le rôle est valide
        if (!in_array($role, ['client', 'manager'])) {
            $role = 'client';
        }
        
        // Créer le nouvel utilisateur
        $user = (object) [
            "full_name" => $data["full_name"],
            "email" => $data["email"],
            "password" => $data["password"],
            "role" => $role,
            "is_active" => true,
        ];

        try {
            $this->repo->add($user);
            
            // Récupérer l'utilisateur créé pour obtenir l'ID
            $createdUser = $this->repo->getByEmail($data["email"]);
            
            if (!$createdUser) {
                throw new \Exception("Erreur lors de la création de l'utilisateur");
            }

            // Générer un token sécurisé
            $token = Str::random(64);
            $this->tokenRepo->create($createdUser->id, $token, 24 * 60);

            // Logger l'inscription
            Log::info('Inscription réussie', [
                'user_id' => $createdUser->id,
                'email' => $createdUser->email,
                'ip' => $request->ip(),
            ]);

            $fullName = $createdUser->full_name ?? $createdUser->name ?? '';

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
                    "token" => $token
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'inscription', [
                'email' => $data["email"],
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                "success" => false,
                "message" => "Erreur lors de l'inscription. Veuillez réessayer."
            ], 500);
        }
    }

    // ME — récupérer l'utilisateur connecté
    public function me(Request $request)
    {
        // L'utilisateur est déjà vérifié par le middleware AuthenticateApi
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non authentifié."
            ], 401);
        }

        $fullName = $user->full_name ?? $user->name ?? '';

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

