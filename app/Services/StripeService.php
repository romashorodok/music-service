<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;
use Stripe\Price;
use Stripe\StripeClient;

class StripeService
{
    public function __construct(
        private readonly StripeClient $client
    )
    {
    }

    private function getProducts(): Collection
    {
        return collect(config('stripe.products'));
    }

    /**
     * @throws ApiErrorException
     */
    private function getPrice(string $priceId): Price
    {
        return $this->client->prices->retrieve($priceId);
    }

    public function retrieveSubscriptionPlans(): Collection
    {
        $products = $this->getProducts();

        return $products->map(function ($product, $name) {
            try {
                $price = $this->getPrice($product['price']);

                return [
                    'subscription_name'     => $name,
                    'subscription_price'    => $price->id,
                    'subscription_currency' => $price->currency,
                    'subscription_amount'   => $price->unit_amount / 100,
                    'subscription_period'   => $price->recurring->interval ?? 'month',
                ];
            } catch (ApiErrorException $e) {
                Log::error('Unable to get price for retrieving subscription plans. With message');
                Log::error($e->getMessage());
                return null;
            }
        })->filter();
    }
}
