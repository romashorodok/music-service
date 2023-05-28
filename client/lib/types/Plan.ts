
export type Plan = {
    priceId: string;

    name: string;
    amount: number;
    period: string;
}

export function getPlanListFromRequest(request: Object) {
    const plans = Object.entries(request['plans']);

    return plans.map(([_, plan]) => {
        return {
            priceId: plan['subscription_price'],
            name: plan['subscription_name'],
            amount: plan['subscription_amount'],
            period: plan['subscription_period']
        } as Plan;
    });
}

