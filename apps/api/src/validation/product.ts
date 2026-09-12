import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
});

export const updateProductSchema = createProductSchema;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;