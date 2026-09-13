import { Router } from "express";
import { login, getUserById } from "../services/auth.service.js";
import { loginSchema } from "../validation/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import { requireAuth } from "../middleware/require-auth.js";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_MS,
  signSession,
} from "../utils/jwt.js";

const router = Router();

const isProduction = process.env.NODE_ENV === "production";

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: {
          message: "Invalid login data",
          code: "VALIDATION_ERROR",
          details: result.error.issues,
        },
      });
      return;
    }

    const user = await login(result.data);

    const token = signSession({
      userId: user.id,
      email: user.email,
    });

    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE_MS,
    });

    sendSuccess(res, user);
  }),
);

router.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME);
  res.status(204).send();
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.user!.userId);
    sendSuccess(res, user);
  }),
);

export default router;
