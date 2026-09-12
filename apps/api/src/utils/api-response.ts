import type { Response } from "express";

export function sendSuccess<T>(
    res: Response,
    data: T,
    statusCode = 200,
) {
    res.status(statusCode).json({
        data,
    });
}

export function sendError(
    res: Response,
    message: string,
    code: string,
    statusCode: number,
) {
    res.status(statusCode).json({
        error: {
            message,
            code,
        },
    });
}