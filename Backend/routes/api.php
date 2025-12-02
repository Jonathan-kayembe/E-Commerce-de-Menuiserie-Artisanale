<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ImageController;

// Routes API avec préfixe /api
// Note : Les routes API ont automatiquement le préfixe /api (configuré dans bootstrap/app.php)

// Routes API pour l'authentification (rate limiting : 10 tentatives par minute par IP)
// Le contrôleur gère aussi un rate limiting par email (5 tentatives par minute)
Route::post('/auth/register', [AuthController::class, 'register'])
    ->middleware('throttle:10,1')
    ->name('api.auth.register');
Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1')
    ->name('api.auth.login');
Route::post('/auth/logout', [AuthController::class, 'logout'])
    ->middleware('auth.api')
    ->name('api.auth.logout');
Route::get('/auth/me', [AuthController::class, 'me'])
    ->middleware('auth.api')
    ->name('api.auth.me');

// Routes API pour les produits
Route::get('/products', [ProductController::class, 'index'])->name('api.products.index');
Route::post('/products', [ProductController::class, 'store'])->name('api.products.store');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('api.products.show');
Route::put('/products/{id}', [ProductController::class, 'update'])->name('api.products.update');
Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('api.products.destroy');

// Routes API pour les catégories
Route::get('/categories', [CategoryController::class, 'index'])->name('api.categories.index');
Route::post('/categories', [CategoryController::class, 'store'])->name('api.categories.store');
Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('api.categories.show');
Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('api.categories.update');
Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('api.categories.destroy');

// Routes API pour les commandes
Route::get('/orders', [OrderController::class, 'index'])->middleware('auth.api')->name('api.orders.index');
Route::post('/orders', [OrderController::class, 'store'])->middleware('auth.api')->name('api.orders.store');
Route::get('/orders/{id}', [OrderController::class, 'show'])->middleware('auth.api')->name('api.orders.show');
Route::put('/orders/{id}', [OrderController::class, 'update'])->middleware('auth.api')->name('api.orders.update');
Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->middleware('auth.api')->name('api.orders.destroy');
Route::get('/orders/user/{userId}', [OrderController::class, 'getByUser'])->middleware('auth.api')->name('api.orders.byUser');

// Routes API pour les articles de commande
Route::get('/order-items/order/{orderId}', [OrderItemController::class, 'getByOrder'])->name('api.orderItems.byOrder');
Route::post('/order-items', [OrderItemController::class, 'store'])->name('api.orderItems.store');
Route::put('/order-items/{id}', [OrderItemController::class, 'update'])->name('api.orderItems.update');
Route::delete('/order-items/{id}', [OrderItemController::class, 'destroy'])->name('api.orderItems.destroy');

// Routes API pour les paniers
Route::get('/carts/user/{userId}', [CartController::class, 'getByUser'])->middleware('auth.api')->name('api.carts.byUser');
Route::post('/carts', [CartController::class, 'store'])->middleware('auth.api')->name('api.carts.store');
Route::delete('/carts/{id}', [CartController::class, 'destroy'])->middleware('auth.api')->name('api.carts.destroy');

// Routes API pour les articles du panier
Route::get('/cart-items/cart/{cartId}', [CartItemController::class, 'getByCart'])->middleware('auth.api')->name('api.cartItems.byCart');
Route::post('/cart-items', [CartItemController::class, 'store'])->middleware('auth.api')->name('api.cartItems.store');
Route::put('/cart-items/{id}', [CartItemController::class, 'update'])->middleware('auth.api')->name('api.cartItems.update');
Route::delete('/cart-items/{id}', [CartItemController::class, 'destroy'])->middleware('auth.api')->name('api.cartItems.destroy');

// Routes API pour les adresses
Route::get('/addresses/user/{userId}', [AddressController::class, 'getByUser'])->name('api.addresses.byUser');
Route::post('/addresses', [AddressController::class, 'store'])->name('api.addresses.store');
Route::get('/addresses/{id}', [AddressController::class, 'show'])->name('api.addresses.show');
Route::put('/addresses/{id}', [AddressController::class, 'update'])->name('api.addresses.update');
Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->name('api.addresses.destroy');

// Routes API pour les paiements
Route::get('/payments/order/{orderId}', [PaymentController::class, 'getByOrder'])->name('api.payments.byOrder');
Route::post('/payments', [PaymentController::class, 'store'])->name('api.payments.store');
Route::put('/payments/{id}', [PaymentController::class, 'update'])->name('api.payments.update');
Route::delete('/payments/{id}', [PaymentController::class, 'destroy'])->name('api.payments.destroy');

// Routes API pour les avis
Route::get('/reviews/product/{productId}', [ReviewController::class, 'getByProduct'])->name('api.reviews.byProduct');
Route::post('/reviews', [ReviewController::class, 'store'])->name('api.reviews.store');
Route::put('/reviews/{id}', [ReviewController::class, 'update'])->name('api.reviews.update');
Route::delete('/reviews/{id}', [ReviewController::class, 'destroy'])->name('api.reviews.destroy');

// Routes API pour les utilisateurs
Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
Route::get('/users/{id}', [UserController::class, 'show'])->name('api.users.show');
Route::put('/users/{id}', [UserController::class, 'update'])->name('api.users.update');
Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('api.users.destroy');

// Routes API pour les images
Route::post('/images/upload', [ImageController::class, 'uploadProductImage'])
    ->middleware('auth.api')
    ->name('api.images.upload');
Route::delete('/images/delete', [ImageController::class, 'deleteProductImage'])
    ->middleware('auth.api')
    ->name('api.images.delete');

