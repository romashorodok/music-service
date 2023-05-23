import { API_HOST } from "~/env"
import PlanCard from "~/lib/components/PlanCard";
import { Plan, getPlanListFromRequest } from "~/lib/types/Plan";


function getPlanList(): Promise<Array<Plan>> {
    return fetch(`${API_HOST}/subscription/plans`)
        .then(r => r.json())
        .then(getPlanListFromRequest);
}

export default async function Plans() {

    const plans = await getPlanList();

    return <div className="flex flex-row h-full justify-center place-items-center gap-4 p-4">
        {plans.map((plan, key) => (<PlanCard key={key} plan={plan} />))}
    </div>
}
