'use client'

import { CardElement, Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Appearance, StripeCardElement, StripeElementStyle, loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { API_HOST, STRIPE_PUBLISH_KEY, SUBSCRIPTION_PLAN_KEY } from "~/env";
import { Plan } from "~/lib/types/Plan";
import * as Form from "@radix-ui/react-form";


const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);

export default function Subscribe() {
    const { push } = useRouter();

    const [plan, setPlan] = React.useState<Plan>(undefined);
    const [subscription, setSubscription] = React.useState<Subscription>(undefined);

    React.useMemo(async () => {
        const plan: Plan = JSON.parse(sessionStorage.getItem(SUBSCRIPTION_PLAN_KEY) || undefined);

        if (!plan) {
            push('/plans');
        }

        setPlan(plan);

        const { data: subscription } = await axios.post(`${API_HOST}/subscription`, {
            'subscription_price': plan.priceId
        });

        setSubscription(subscription);
    }, []);

    return (
        <div className="">
            <div className="w-[50%] my-[20px] mx-[auto] space-y-4">
                <h2 className="text-lg">Your plan</h2>

                <PlanCard plan={plan} />

                {subscription
                    ? <PaymentElementProvider subscription={subscription} />
                    : <p>Loading...</p>}

            </div>
        </div>
    )
}

type Subscription = {
    payment_intent: Object;
    subscription_id: string;
}

const appearance: Appearance = {
    theme: 'stripe',

    variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: 'white',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '4px',
    }
};

function PaymentElementProvider({ subscription }: { subscription: Subscription }) {
    const options = {
        clientSecret: subscription.payment_intent['client_secret'],
        appearance
    }

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentForm subscription={subscription} />
        </Elements>
    );
}

const stripePaymentCardStyles: StripeElementStyle = {
    base: {
        fontSize: "1.25rem",
        color: "white",

        '::placeholder': {
            color: "white"
        }
    },

}

function PaymentForm({ subscription }: { subscription: Subscription }) {
    const elements = useElements();
    const stripe = useStripe();

    const [card, setCard] = React.useState<StripeCardElement>(null);

    React.useEffect(() => {
        if (elements) {
            setCard(elements.getElement('card'));
        }
    }, [elements]);

    React.useEffect(() => {
        if (card) {
            card.update({
                style: stripePaymentCardStyles,
            });
        }
    }, [card]);

    async function OnSubmit(event: React.FormEvent) {
        event.preventDefault();

        const result = await stripe.confirmCardPayment(subscription.payment_intent['client_secret'], {
            payment_method: {
                card
            }
        });

        console.log(result);
    }

    return (
        <Form.Root className="space-y-4" onSubmit={OnSubmit}>
            <div className="p-3 w-full h-full overflow-hidden bg-primary rounded shadow-[1px_1px_20px_black]">
                <CardElement />
            </div>

            <Form.Submit asChild>
                <button type="submit"
                    className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[35px] w-full rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative">
                    Submit
                </button>
            </Form.Submit>
        </Form.Root>
    );
}

function PlanCard({ plan }: { plan: Plan }) {
    return (
        <div className="p-4 w-full h-full overflow-hidden bg-primary rounded shadow-[1px_1px_20px_black]">
            <h3>{plan.name}</h3>
            <h3>{plan.period}</h3>
            <h3>{plan.amount}</h3>
            <h3>{plan.priceId}</h3>
        </div>
    );
}
