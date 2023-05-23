<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Subscription\CreateSubscriptionRequest;
use App\Models\User;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Exceptions\CustomerAlreadyCreated;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly StripeService $stripeService,
        private readonly StripeClient  $client,
    )
    {
    }

    public function createCustomer(Request $request)
    {
        /* @var User $user */
        $user = Auth::guard('api')->user();

        try {
            $stripeCustomer = $user->createAsStripeCustomer();

            dd($stripeCustomer);

        } catch (CustomerAlreadyCreated $e) {
        }
    }

    /**
     * @throws ApiErrorException
     */
    public function createSubscription(CreateSubscriptionRequest $request): JsonResponse
    {
        $subsPrice = $request->get('subscription_price');

        /* @var User $user */
        $user = Auth::guard('api')->user();
        $customer = $user->asStripeCustomer();

        $subscription = $this->client->subscriptions->create([
            'customer'         => $customer->id,
            'payment_behavior' => 'default_incomplete',

            'expand' => [
                'latest_invoice.payment_intent'
            ],
            'items'  => [
                ['price' => $subsPrice]
            ],
        ]);

        return response()->json([
            'subscription_id' => $subscription->id,
            'payment_intent'  => $subscription->latest_invoice->payment_intent
        ]);
    }

    /**
     * @throws ApiErrorException
     */
    public function getInvoiceInfo(Request $request): JsonResponse
    {
        $paymentIntent = $request->get('payment_intent');

        return response()->json($this->client->invoices->retrieve($paymentIntent['invoice']));
    }

    /**
     * @throws ApiErrorException
     */
    public function getSubscriptionPlans(): JsonResponse
    {
        return response()->json(['plans' => $this->stripeService->retrieveSubscriptionPlans()]);
    }
}
