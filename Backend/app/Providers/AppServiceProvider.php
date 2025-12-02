<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\IProductRepository;
use App\Repositories\PdoProductRepository;
use App\Repositories\ICategoryRepository;
use App\Repositories\PdoCategoryRepository;
use App\Repositories\IOrderRepository;
use App\Repositories\PdoOrderRepository;
use App\Repositories\IOrderItemRepository;
use App\Repositories\PdoOrderItemRepository;
use App\Repositories\ICartRepository;
use App\Repositories\PdoCartRepository;
use App\Repositories\ICartItemRepository;
use App\Repositories\PdoCartItemRepository;
use App\Repositories\IAddressRepository;
use App\Repositories\PdoAddressRepository;
use App\Repositories\IPaymentRepository;
use App\Repositories\PdoPaymentRepository;
use App\Repositories\IReviewRepository;
use App\Repositories\PdoReviewRepository;
use App\Repositories\IUserRepository;
use App\Repositories\PdoUserRepository;
use App\Repositories\IApiTokenRepository;
use App\Repositories\PdoApiTokenRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Injection de dépendance : lie les interfaces aux implémentations
        $this->app->bind(IProductRepository::class, PdoProductRepository::class);
        $this->app->bind(ICategoryRepository::class, PdoCategoryRepository::class);
        $this->app->bind(IOrderRepository::class, PdoOrderRepository::class);
        $this->app->bind(IOrderItemRepository::class, PdoOrderItemRepository::class);
        $this->app->bind(ICartRepository::class, PdoCartRepository::class);
        $this->app->bind(ICartItemRepository::class, PdoCartItemRepository::class);
        $this->app->bind(IAddressRepository::class, PdoAddressRepository::class);
        $this->app->bind(IPaymentRepository::class, PdoPaymentRepository::class);
        $this->app->bind(IReviewRepository::class, PdoReviewRepository::class);
        $this->app->bind(IUserRepository::class, PdoUserRepository::class);
        $this->app->bind(IApiTokenRepository::class, PdoApiTokenRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
