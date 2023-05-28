'use client'

import { API_HOST } from "~/env"
import { Plan, getPlanListFromRequest } from "~/lib/types/Plan";
import styles from "./page.module.scss";
import { GRANTS, useSubscription } from "~/lib/hooks/useSubscription";
import React from "react";
import { Subscription } from "~/lib/contexts/SubscriptionContext";
import { PlanCard } from "~/lib/components/PlanCard";

function getPlanList(): Promise<Array<Plan>> {
    return fetch(`${API_HOST}/subscription/plans`, {
        cache: 'no-cache'
    })
        .then(r => r.json())
        .then(getPlanListFromRequest);
}

export default function Plans() {
    const [plans, setPlans] = React.useState<Array<Plan>>();
    const [subscriptions, setSubscriptions] = React.useState<Array<Subscription>>();

    const subscription = useSubscription();

    React.useEffect(() => {
        (async () => {
            setSubscriptions(await subscription.refresh());
            setPlans(await getPlanList());
        })().catch(console.error)
    }, []);

    function activePlan(priceId: string) {
        return subscriptions.some(subscription => subscription.stripe_price == priceId);
    }

    return <div className={`${styles.plans_wrapper} flex h-full justify-center place-items-center gap-4 p-4`}>
        {plans && subscriptions
            ? plans.map((plan, key) => (
                <PlanCard key={key} plan={plan} active={activePlan(plan.priceId)}>
                    <PlanCardGrantsDescription name={plan.name} />
                </PlanCard>
            ))
            : null}
    </div>
}


function PlanCardGrantsDescription({ name }: { name: string }) {
    const subscriptionGrantsDescription: Array<string> = GRANTS[name.toUpperCase()];

    return <ul className="list-disc list-inside">
        {subscriptionGrantsDescription.map((description, key) => (
            <li key={key}>
                {description}
            </li>
        ))}
    </ul>
}

