<?php

namespace App\Http\Controllers\Stripe;


use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WebhookController extends \Laravel\Cashier\Http\Controllers\WebhookController
{
    public function handler(Request $request): Response
    {
        return $this->handleWebhook($request);
    }
}
