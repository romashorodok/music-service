'use client'

import { useRouter } from "next/navigation";
import { Plan } from "../types/Plan";
import { SUBSCRIPTION_PLAN_KEY } from "~/env";

type Props = {
    plan: Plan
};

export default function PlanCard({ plan }: Props) {
    const { push } = useRouter();

    function selectSubscribePlan() {
        sessionStorage.setItem(SUBSCRIPTION_PLAN_KEY, JSON.stringify(plan));
        push('/subscribe');
    }

    return (
        <div className="p-4 w-full h-full overflow-hidden bg-primary rounded-lg shadow-[1px_1px_20px_black]">
            <h3>{plan.name}</h3>
            <h3>{plan.period}</h3>
            <h3>{plan.amount}</h3>
            <h3>{plan.priceId}</h3>

            <button
                onClick={selectSubscribePlan}
                className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative">
                Select {plan.name}
            </button>
        </div>
    );
}
