<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Rate limiting pour les routes d'authentification
        $middleware->throttleApi('60,1'); // 60 requêtes par minute par défaut
        
        // Alias pour le middleware d'authentification API
        $middleware->alias([
            'auth.api' => \App\Http\Middleware\AuthenticateApi::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Personnaliser le message d'erreur pour le rate limiting
        $exceptions->render(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e, \Illuminate\Http\Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.'
                ], 429);
            }
        });
    })->create();
