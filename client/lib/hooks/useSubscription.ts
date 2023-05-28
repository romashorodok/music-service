import React from "react";
import { Subscription, SubscriptionContext } from "../contexts/SubscriptionContext";
import axios from "axios";
import { API_HOST } from "~/env";

export const SUBSCRIPTIONS = {
    "UNLIMITED": "Unlimited",
    "EXTENDED": "Extended",
} as const;

export const GRANTS: { [subscription in SUBSCRIPTION]: Array<String> } = {
    "UNLIMITED": [
        "You are able to change audio duration",
        "You can chose High level bitrate"
    ],
    "EXTENDED": [
        "You are able to change audio duration",
    ]
};

type SUBSCRIPTION = keyof typeof SUBSCRIPTIONS;

export function useSubscription() {
    const { subscriptions, setSubscriptions } = React.useContext(SubscriptionContext);

    const subscriberAction = React.useCallback(function({
        grants
    }: { grants: Array<SUBSCRIPTION> }) {
        return grants.some(grant =>
            subscriptions.some(subscription => subscription.name === SUBSCRIPTIONS[grant])
        );
    }, [subscriptions]);

    async function refresh(): Promise<Array<Subscription>> {
        const { data: subscriptions } = await axios.get(`${API_HOST}/subscription/status`);
        setSubscriptions(subscriptions);
        return subscriptions;
    }

    return { subscriberAction, refresh };
}
