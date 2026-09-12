import "dotenv/config";
import express from "express";
import { prisma } from "@wholesale/db";
import { createProductSchema } from "./validation/products.js";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./services/product.service.js";
import { errorHandler } from "./middleware/error-handler.js";
import "express-async-errors";

const app = express();

app.use(express.json());

app.get("/health", async (_, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({status: "ok", database: "connected"});
});

app.get("/products", async (_req, res) => {
    const products = await getProducts();
    res.json(products);
});

app.post("/products", async (req, res) => {
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

app.put("/products/:id", async (req, res) => {
    const result = createProductSchema.safeParse(req.body);
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

app.delete("/products/:id", async (req, res) => {
    await deleteProduct(req.params.id);
    res.status(204).send();
})

app.use(errorHandler);

app.listen(4000, () => {
    console.log("API running on http://localhost:4000");
});