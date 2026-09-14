import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return secret;
}

export interface SessionPayload {
  userId: string;
  email: string;
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, getJwtSecret()) as unknown as SessionPayload;
}

export const SESSION_COOKIE_NAME = "session";
export const SESSION_COOKIE_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;
