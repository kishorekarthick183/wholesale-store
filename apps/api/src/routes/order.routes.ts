import { Router } from "express";
import { 
    createOrder, 
    getOrder, 
    getOrders, 
    updateOrderStatus,
    submitPayment,
} from "../services/order.service.js";
import { createOrderSchema, updateOrderStatusSchema } from "../validation/order.js";
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

router.patch(
    "/:id/status",
    asyncHandler(async (req, res) => {
        const result = updateOrderStatusSchema.safeParse(
            req.body,
        );

        if (!result.success) {
            res.status(400).json({
                error: {
                    message: "Invalid order status",
                    code: "VALIDATION_ERROR",
                    details: result.error.issues,
                },
            });

            return;
        }

        const order = await updateOrderStatus(
            req.params.id as string,
            result.data.status,
        );

        sendSuccess(res, order);
    }),
);

router.patch(
    "/:id/status",
    asyncHandler(async (req, res) => {
        const result = updateOrderStatusSchema.safeParse(
            req.body,
        );

        if (!result.success) {
            res.status(400).json({
                error: {
                    message: "Invalid order status",
                    code: "VALIDATION_ERROR",
                    details: result.error.issues,
                },
            });

            return;
        }

        const order = await updateOrderStatus(
            req.params.id as string,
            result.data.status,
        );

        sendSuccess(res, order);
    }),
);

router.post(
    "/:id/payment-submitted",
    asyncHandler(async (req, res) => {
        const order = await submitPayment(req.params.id);

        sendSuccess(res, order);
    }),
);

export default router;