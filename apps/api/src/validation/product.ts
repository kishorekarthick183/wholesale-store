import { z } from "zod";

export const createProductSchema = z
    .object({
        name: z.string().trim().min(1).max(200),
        description: z.string().trim().max(1000).optional(),
        price: z.number().positive(),
        stock: z.number().int().nonnegative(),
    })
    .strict();

export const updateProductSchema = createProductSchema;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;