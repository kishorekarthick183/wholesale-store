import { Router } from "express";
import { createOrder, getOrder, getOrders } from "../services/order.service.js";
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

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const order = await getOrder(req.params.id as string);

        sendSuccess(res, order);
    }),
);

router.get(
    "/",
    asyncHandler(async (_req, res) => {
        const orders = await getOrders();

        sendSuccess(res, orders);
    }),
);

export default router;