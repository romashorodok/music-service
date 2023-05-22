<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Stripe\StripeClient;

class StripeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $clientInstance = new StripeClient([
            'api_key' => config('stripe.secret'),
        ]);

        $this->app->singleton(StripeClient::class, fn() => $clientInstance);
    }
}
