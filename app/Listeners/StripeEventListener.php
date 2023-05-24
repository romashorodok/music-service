<?php

namespace App\Listeners;

use App\Models\Enums\StripeEvent;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Events\WebhookReceived;


class StripeEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(WebhookReceived $event): void
    {
        match ($event->payload['type']) {
            StripeEvent::SUBSCRIPTION_UPDATED => function () use ($event) {
                $customer = $event['data']['object']['customer'];

                $user = User::query()->where('stripe_id', "=", $customer)->first();

                Log::info($user);
            },

            default => Log::info(sprintf("Received unhandled event %s", $event->payload['type']))
        };
    }
}
