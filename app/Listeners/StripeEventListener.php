<?php

namespace App\Listeners;

use App\Http\Controllers\Stripe\WebhookController;
use App\Models\Enums\StripeEvent;
use App\Models\User;
use App\Services\StripeService;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Events\WebhookReceived;
use Stripe\Exception\ApiErrorException;


class StripeEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct(
        private readonly StripeService $stripeService,
    )
    {
        //
    }

    /**
     * @throws ApiErrorException
     */
    public function updateSubscriptionBySuccessPayment(array $event): void
    {
        $priceId = $event['data']['object']['lines']['data'][0]['plan']['id'];
        $subscriptionId = $event['data']['object']['lines']['data'][0]['subscription'];

        $this->stripeService->freshSubscription($subscriptionId, $priceId);
    }

    /**
     * Handle the event.
     * @throws ApiErrorException
     */
    public function handle(WebhookReceived $event): void
    {
        match ($event->payload['type']) {
            StripeEvent::PAYMENT_SUCCEDED->value => $this->updateSubscriptionBySuccessPayment($event->payload),

            default => Log::info(sprintf("Received unhandled event %s", $event->payload['type']))
        };
    }
}
