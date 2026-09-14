import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

process.env.JWT_SECRET = "test-secret";

const { requireAuth } = await import("../require-auth.js");
const { signSession, SESSION_COOKIE_NAME } = await import("../../utils/jwt.js");

function mockRes() {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

describe("requireAuth", () => {
    let next: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        next = vi.fn();
    });

    it("rejects a request with no session cookie", () => {
        const req = { cookies: {} } as unknown as Request;
        const res = mockRes();

        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects a garbage/expired token", () => {
        const req = {
            cookies: { [SESSION_COOKIE_NAME]: "not-a-real-token" },
        } as unknown as Request;
        const res = mockRes();

        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("accepts a valid session and attaches the user to the request", () => {
        const token = signSession({
            userId: "user-1",
            email: "owner@example.com",
        });
        const req = {
            cookies: { [SESSION_COOKIE_NAME]: token },
        } as unknown as Request;
        const res = mockRes();

        requireAuth(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
        expect(req.user).toMatchObject({ userId: "user-1" });
    });
});