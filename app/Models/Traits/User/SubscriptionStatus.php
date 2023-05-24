<?php

declare(strict_types=1);

namespace App\Models\Traits\User;

trait SubscriptionStatus
{
    public function subscriptionStatus()
    {
        $subscriptions = $this->subscriptions()->newQuery()
            ->where("stripe_status", "=", "active")->get()->all();

        return $subscriptions;
    }
}
