import type { Request, Response, NextFunction } from "express";
import { SESSION_COOKIE_NAME, verifySession } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token) {
    res.status(401).json({
      error: {
        message: "Not authenticated",
        code: "UNAUTHENTICATED",
      },
    });
    return;
  }

  try {
    req.user = verifySession(token);
    next();
  } catch {
    res.status(401).json({
      error: {
        message: "Session expired or invalid",
        code: "UNAUTHENTICATED",
      },
    });
  }
}
