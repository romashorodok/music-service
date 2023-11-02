<?php

namespace App\Http\Controllers\Stripe;


use Illuminate\Http\Request;

class WebhookController extends \Laravel\Cashier\Http\Controllers\WebhookController
{
    public function handler(Request $request): void
    {
        $this->handleWebhook($request);
    }
}
