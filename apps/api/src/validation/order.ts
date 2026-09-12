import { z } from "zod";

export const createOrderSchema = z
    .object({
        name: z.string().trim().min(1).max(200),
        phone: z.string().trim().min(10).max(15),
        items: z
            .array(
                z.object({
                    productId: z.string().uuid(),
                    quantity: z.number().int().positive(),
                }),
            )
            .min(1),
    })
    .strict();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;