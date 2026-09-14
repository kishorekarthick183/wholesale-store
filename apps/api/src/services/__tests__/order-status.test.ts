import { describe, it, expect } from "vitest";
import { isValidStatusTransition } from "../order-status.js";

describe("isValidStatusTransition", () => {
    it("allows the full happy-path lifecycle in order", () => {
        expect(isValidStatusTransition("PENDING", "PAYMENT_SUBMITTED")).toBe(
            true,
        );
        expect(isValidStatusTransition("PAYMENT_SUBMITTED", "PAID")).toBe(
            true,
        );
        expect(isValidStatusTransition("PAID", "PREPARING")).toBe(true);
        expect(isValidStatusTransition("PREPARING", "READY")).toBe(true);
        expect(isValidStatusTransition("READY", "COMPLETED")).toBe(true);
    });

    it("allows cancelling before payment is confirmed", () => {
        expect(isValidStatusTransition("PENDING", "CANCELLED")).toBe(true);
        expect(
            isValidStatusTransition("PAYMENT_SUBMITTED", "CANCELLED"),
        ).toBe(true);
    });

    it("rejects cancelling once payment has been confirmed", () => {
        expect(isValidStatusTransition("PAID", "CANCELLED")).toBe(false);
        expect(isValidStatusTransition("PREPARING", "CANCELLED")).toBe(false);
        expect(isValidStatusTransition("READY", "CANCELLED")).toBe(false);
    });

    it("rejects skipping steps forward", () => {
        expect(isValidStatusTransition("PENDING", "PAID")).toBe(false);
        expect(isValidStatusTransition("PAID", "READY")).toBe(false);
        expect(isValidStatusTransition("PENDING", "COMPLETED")).toBe(false);
    });

    it("rejects moving backwards", () => {
        expect(isValidStatusTransition("PAID", "PENDING")).toBe(false);
        expect(isValidStatusTransition("COMPLETED", "READY")).toBe(false);
    });

    it("treats COMPLETED and CANCELLED as terminal", () => {
        expect(isValidStatusTransition("COMPLETED", "PENDING")).toBe(false);
        expect(isValidStatusTransition("COMPLETED", "CANCELLED")).toBe(false);
        expect(isValidStatusTransition("CANCELLED", "PENDING")).toBe(false);
    });

    it("rejects unknown statuses", () => {
        expect(isValidStatusTransition("NOT_A_STATUS", "PAID")).toBe(false);
    });
});