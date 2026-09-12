import { Router } from "express";
import { createOrder } from "../services/order.service.js";
import { createOrderSchema } from "../validation/order.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";

const router = Router();

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = createOrderSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                error: {
                    message: "Invalid order data",
                    code: "VALIDATION_ERROR",
                    details: result.error.issues,
                },
            });

            return;
        }

        const order = await createOrder(result.data);

        sendSuccess(res, order, 201);
    }),
);

export default router;