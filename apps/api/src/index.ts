import "dotenv/config";
import express from "express";
import { prisma } from "@wholesale/db";
import { createProductSchema } from "./validation/products.js";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./services/product.service.js";

const app = express();

app.use(express.json());

app.get("/health", async (_, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({status: "ok", database: "connected"});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "error", database: "disconnected"});
    }
});

app.get("/products", async (_req, res) => {
    try {
        const products = await getProducts();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to fetch products"});
    }
});

app.post("/products", async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to create product" });
    }
});

app.put("/products/:id", async (req, res) => {
    try {
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
    } catch(error) {   
        console.error(error);
        res.status(500).json({
            error: "Failed to update product",
        });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        await deleteProduct(req.params.id);
        res.json(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete product",
        });
    }
})

app.listen(4000, () => {
    console.log("API running on http://localhost:4000");
});