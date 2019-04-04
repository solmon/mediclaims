export class PlanDetails {
    id: number;
    name: string;
    planId: string;
    total: number;
    claimed: number;
    remaining: number;
    spending: object;
    hospital: object;
    claimDetail: [{}];
    notification: [{}];
}
export class ActivePlanDetails {
    title: string;
    planName: string;
    planId: string;
    claimID: string;
    date: string;
    status: string;
    insurancePay: number;
    yourPay: number;
    total: number;
    breakdown: [{}];
    expenses: {};
}
