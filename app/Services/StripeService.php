<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Exceptions\InvalidCustomer;
use Stripe\Exception\ApiErrorException;
use Stripe\Price;
use Stripe\Product;
use Stripe\StripeClient;
use Stripe\Subscription;

class StripeService
{
    public function __construct(
        private readonly StripeClient $client
    )
    {
    }

    /**
     * @throws ApiErrorException
     */
    private function getProduct(string $productId): Product
    {
        return $this->client->products->retrieve($productId);
    }

    /**
     * @throws ApiErrorException
     */
    public function freshSubscription(string $subscriptionId, string $priceId): void
    {
        $price = $this->getPrice($priceId);
        $subscription = $this->retrieveSubscription($subscriptionId);
        $product = $this->getProduct($price->product);

        $endsAt = Carbon::createFromTimestamp($subscription['current_period_end']);

        \Laravel\Cashier\Subscription::query()
            ->where("stripe_id", "=", $subscription->id)
            ->update([
                'name' => $product->name,
                'expires_at' => $endsAt,
            ]);
    }

    /**
     * @throws ApiErrorException
     */
    private function retrieveSubscription(string $subscriptionId): Subscription
    {
        $subscription = $this->client->subscriptions->retrieve($subscriptionId);
        $subscription['latest_invoice'] = $this->client->invoices->retrieve($subscription['latest_invoice']);
        $subscription['latest_invoice']['payment_intent'] = $this->client->paymentIntents->retrieve($subscription['latest_invoice']['payment_intent']);

        return $subscription;
    }

    /**
     * @throws ApiErrorException
     */
    private function createSubscription(User $user, string $subscriptionPrice): Subscription
    {
        $customer = $user->asStripeCustomer();

        return $this->client->subscriptions->create([
            'customer' => $customer->id,
            'payment_behavior' => 'default_incomplete',

            'expand' => [
                'latest_invoice.payment_intent'
            ],
            'items' => [
                ['price' => $subscriptionPrice]
            ],
        ]);
    }

    /**
     * @throws ApiErrorException
     * @throws InvalidCustomer
     */
    public function getSubscriptionOrCreate(User $user, string $subscriptionPrice): Subscription
    {
        $subscription = $user->subscriptions()
            ->where('stripe_status', '=', 'incomplete')
            ->where('stripe_price', "=", $subscriptionPrice)
            ->first();

        return $subscription
            ? $this->retrieveSubscription($subscription['stripe_id'])
            : $this->createSubscription($user, $subscriptionPrice);
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
                $price = $this->getPrice($product['product']);

                return [
                    'subscription_name' => ucfirst($name),
                    'subscription_price' => $price->id,
                    'subscription_currency' => $price->currency,
                    'subscription_amount' => $price->unit_amount / 100,
                    'subscription_period' => $price->recurring->interval ?? 'month',
                ];
            } catch (ApiErrorException $e) {
                Log::error('Unable to get price for retrieving subscription plans. With message');
                Log::error($e->getMessage());
                return null;
            }
        })->filter();
    }
}
