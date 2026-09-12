import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api-error.js";

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            error: error.message,
        });
        return;
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
}