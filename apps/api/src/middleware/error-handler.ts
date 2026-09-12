import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api-error.js";
import { sendError } from "../utils/api-response.js";

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (error instanceof ApiError) {
        sendError(res, error.message, "API_ERROR", error.statusCode);
        return;
    }
    console.error(error);
    sendError(res, "Internal server error", "INTERNAL_SERVER_ERROR", 500);
}