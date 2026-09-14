const TRANSITIONS: Record<string, string[]> = {
    PENDING: ["PAYMENT_SUBMITTED", "CANCELLED"],
    PAYMENT_SUBMITTED: ["PAID", "CANCELLED"],
    PAID: ["PREPARING"],
    PREPARING: ["READY"],
    READY: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
};

export function isValidStatusTransition(
    current: string,
    next: string,
): boolean {
    return TRANSITIONS[current]?.includes(next) ?? false;
}