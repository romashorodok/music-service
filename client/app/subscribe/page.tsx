'use client'

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { Appearance, StripeCardElement, StripeElementStyle, StripeError, loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { API_HOST, STRIPE_PUBLISH_KEY, SUBSCRIPTION_PLAN_KEY } from "~/env";
import { Plan } from "~/lib/types/Plan";
import * as Form from "@radix-ui/react-form";
import { GRANTS } from "~/lib/hooks/useSubscription";
import * as Separator from '@radix-ui/react-separator';
import styles from './page.module.scss';

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
        <div className="relative flex place-items-center justify-center w-full h-full">
            <div className={`${styles.subscribe_wrapper} w-[400px] space-y-4`}>
                <PlanCard plan={plan} />

                {subscription
                    ? <PaymentElementProvider subscription={subscription} />
                    : <p>Loading...</p>}

                <div className="absolute right-4 bottom-1 p-4 overflow-hidden bg-primary rounded-lg shadow-[1px_1px_20px_black]">
                    <p>valid card: 4242424242424242</p>
                    <p>invalid card: 4000000000000002</p>
                    <p>exp date: any feature</p>
                    <p>cvc: any three numbers</p>
                </div>
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
    const [cardError, setStripeError] = React.useState<StripeError>(null);

    React.useEffect(() => {
        if (elements) {
            setCard(elements.getElement('card'));
        }
    }, [elements]);

    React.useEffect(() => {
        if (card) {
            card.update({
                style: stripePaymentCardStyles,
                hidePostalCode: true,
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

        if (result.error) {
            setStripeError(result.error);
        }
    }

    return (
        <Form.Root className="space-y-4" onSubmit={OnSubmit}>
            <Form.Field name="card">
                {cardError
                    ? (

                        <div className="flex flex-col-reverse text-right">
                            <Form.Message className="text-base text-red-400 font-italic opacity-[0.8]">
                                {cardError.message}
                            </Form.Message>
                        </div>

                    )
                    : null
                }
                <div className="p-3 w-full h-full overflow-hidden bg-primary rounded shadow-[1px_1px_20px_black]">
                    <CardElement />
                </div>
            </Form.Field>

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
    const subscriptionGrantsDescription: Array<string> = GRANTS[plan.name.toUpperCase()];

    return (
        <div className="relative p-4 overflow-hidden bg-primary rounded-lg shadow-[1px_1px_20px_black]">
            <div>
                <h2 className="text-lg font-bold">{plan.name} plan</h2>
                <p className="font-light">${plan.amount} / {plan.period}</p>
                <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
                <ul className="list-disc list-inside">
                    {subscriptionGrantsDescription.map((description, key) => (
                        <li key={key}>
                            {description}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
