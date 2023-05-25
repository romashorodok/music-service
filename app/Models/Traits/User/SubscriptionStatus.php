<?php

declare(strict_types=1);

namespace App\Models\Traits\User;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

trait SubscriptionStatus
{
    public function subscriptionStatus(): Collection
    {
        return $this->subscriptions()
            ->select(
                'name',
                DB::raw('stripe_price AS subscription_price'),
                DB::raw('MAX(expires_at) AS expires_at')
            )
            ->where('stripe_status', '=', 'active')
            ->groupBy('name', 'stripe_price', 'created_at')
            ->get();
    }
}
