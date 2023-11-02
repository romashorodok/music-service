'use client'

import { useRouter } from "next/navigation";
import { Plan } from "../types/Plan";
import { SUBSCRIPTION_PLAN_KEY } from "~/env";
import "~/styles/components/PlanCard.scss";
import * as Separator from '@radix-ui/react-separator';

export function PlanCard({ active, plan, children }: React.PropsWithChildren<{ active?: boolean, plan: Plan }>) {
    const { push } = useRouter();

    function selectSubscribePlan() {
        sessionStorage.setItem(SUBSCRIPTION_PLAN_KEY, JSON.stringify(plan));
        push('/subscribe');
    }

    return (
        <div className="plan_card_wrapper relative p-4 h-[240px] overflow-hidden bg-primary rounded-lg shadow-[1px_1px_20px_black]">
            <div>
                <h2 className="text-lg font-bold">{plan.name} plan</h2>
                <p className="font-light">${plan.amount} / {plan.period}</p>
                <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
                {children}
            </div>
            <div className="plan_card_button absolute bottom-[23px]">
                {active
                    ? <p
                        className="px-[10px] border-[var(--lime11)] border-[1px] text-black bg-lime9 select-none flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-lime10 focus:relative">
                        Active {plan.name}
                    </p>
                    : <button
                        onClick={selectSubscribePlan}
                        className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative">
                        Select {plan.name}
                    </button>
                }
            </div>
        </div>
    );
}

