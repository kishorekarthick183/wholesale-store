import { describe, it, expect, vi, beforeEach } from "vitest";

const findUnique = vi.fn();

vi.mock("@wholesale/db", () => ({
    prisma: {
        user: { findUnique },
    },
}));

vi.mock("bcryptjs", () => ({
    default: {
        compare: vi.fn(),
    },
}));

const bcrypt = (await import("bcryptjs")).default;
const { login, getUserById } = await import("../auth.service.js");
const { ApiError } = await import("../../errors/api-error.js");

beforeEach(() => {
    vi.clearAllMocks();
});

describe("login", () => {
    it("rejects an unknown email without leaking whether the account exists", async () => {
        findUnique.mockResolvedValue(null);

        await expect(
            login({ email: "nobody@example.com", password: "whatever" }),
        ).rejects.toBeInstanceOf(ApiError);
    });

    it("rejects a wrong password", async () => {
        findUnique.mockResolvedValue({
            id: "user-1",
            email: "owner@example.com",
            name: "Owner",
            passwordHash: "hashed",
        });
        vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

        await expect(
            login({ email: "owner@example.com", password: "wrong" }),
        ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("returns the user (without the password hash) on success", async () => {
        findUnique.mockResolvedValue({
            id: "user-1",
            email: "owner@example.com",
            name: "Owner",
            passwordHash: "hashed",
        });
        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

        const user = await login({
            email: "owner@example.com",
            password: "correct-password",
        });

        expect(user).toEqual({
            id: "user-1",
            email: "owner@example.com",
            name: "Owner",
        });
        expect(user).not.toHaveProperty("passwordHash");
    });
});

describe("getUserById", () => {
    it("throws a 401 (not 404) when the session refers to a deleted user", async () => {
        findUnique.mockResolvedValue(null);

        await expect(getUserById("missing-id")).rejects.toMatchObject({
            statusCode: 401,
        });
    });

    it("returns the user for a valid id", async () => {
        findUnique.mockResolvedValue({
            id: "user-1",
            email: "owner@example.com",
            name: "Owner",
            passwordHash: "hashed",
        });

        await expect(getUserById("user-1")).resolves.toEqual({
            id: "user-1",
            email: "owner@example.com",
            name: "Owner",
        });
    });
});