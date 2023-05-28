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
        return DB::table('subscriptions')
            ->select('name', 'stripe_price', DB::raw('MAX(expires_at) AS expires_at'))
            ->where('user_id', "=", $this['id'])
            ->where('stripe_status', "=", "active")
            ->where("expires_at", ">", Carbon::now())
            ->groupBy('name', 'stripe_price')
            ->get();
    }
}
