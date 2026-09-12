import "dotenv/config";
import express from "express";
import { prisma } from "@wholesale/db";
import { errorHandler } from "./middleware/error-handler.js";
import "express-async-errors";
import productRoutes from "../src/routes/product.routes.js";

const app = express();

app.use(express.json());

app.get("/health", async (_, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({status: "ok", database: "connected"});
});

app.use("/products", productRoutes);

app.use(errorHandler);

app.listen(4000, () => {
    console.log("API running on http://localhost:4000");
});