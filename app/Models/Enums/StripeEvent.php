<?php

namespace App\Models\Enums;

enum StripeEvent: string
{
    case PAYMENT_SUCCEDED = "invoice.payment_succeeded";
    case SUBSCRIPTION_UPDATED = "customer.subscription.updated";
}
