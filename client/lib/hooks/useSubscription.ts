import React from "react";
import { SubscriptionContext } from "../contexts/SubscriptionContext";

const SUBSCRIPTIONS = {
    "UNLIMITED": "Unlimited",
    "EXTENDED": "Extended",
} as const;

type SUBSCRIPTION = keyof typeof SUBSCRIPTIONS;

export function useSubscription() {
    const { subscriptions } = React.useContext(SubscriptionContext);

    const subscriberAction = React.useCallback(function({
        grants
    }: { grants: Array<SUBSCRIPTION> }) {
        return grants.some(grant =>
            subscriptions.some(subscription => subscription.name === SUBSCRIPTIONS[grant])
        );
    }, [subscriptions]);

    return { subscriberAction };
}
