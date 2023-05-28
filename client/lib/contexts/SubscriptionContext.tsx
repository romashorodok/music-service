'use client'

import React from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { API_HOST } from "~/env";

export type Subscription = {
    name: string;
    stripe_price: string;
}

export const SubscriptionContext = React.createContext<{
    subscriptions: Array<Subscription>;
    setSubscriptions: React.Dispatch<React.SetStateAction<Array<Subscription>>>
}>({
    subscriptions: [],
    setSubscriptions: null,
});

export function SubscriptionContextProvider({ children }: React.PropsWithChildren) {

    const [subscriptions, setSubscriptions] = React.useState<Array<Subscription>>([]);

    const { accessToken } = useAuth();

    React.useEffect(() => {
        if (accessToken) {
            (async () => {
                const { data: subscriptions } = await axios.get(`${API_HOST}/subscription/status`);
                setSubscriptions(subscriptions);
            })()
        } else {
            setSubscriptions([]);
        }
    }, [accessToken])

    return (
        <SubscriptionContext.Provider value={{ subscriptions, setSubscriptions }}>
            {children}
        </SubscriptionContext.Provider>
    );
}
