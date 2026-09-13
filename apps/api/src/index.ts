import "dotenv/config";
import express from "express";
import { errorHandler } from "./middleware/error-handler.js";
import productRoutes from "./routes/product.routes.js";
import healthRoutes from "./routes/health.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);

app.use("/health", healthRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use(errorHandler);

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
