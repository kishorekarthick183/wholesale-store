import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "../services/product.service.js";
import {
    createProductSchema,
    updateProductSchema,
} from "../validation/product.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", 
    asyncHandler(async (_req, res) => {
        const products = await getProducts();
        res.json(products);
    }),
);

router.post("/", async (req, res) => {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid product data",
            details: result.error.issues,
        });
        return;
    }

    const product = await createProduct(result.data);
    res.status(201).json(product);
});

router.put("/:id", async (req, res) => {
    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            error: "Invalid product data",
            details: result.error.issues,
        });
        return;
    }

    const product = await updateProduct(req.params.id, result.data);
    res.json(product);
});

router.delete("/:id", async (req, res) => {
    await deleteProduct(req.params.id);
    res.status(204).send();
})

export default router;