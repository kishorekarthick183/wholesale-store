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
import { sendSuccess } from "../utils/api-response.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const products = await getProducts();
    sendSuccess(res, products);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: "Invalid product data",
        details: result.error.issues,
      });
      return;
    }

    const product = await createProduct(result.data);
    sendSuccess(res, product, 201);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Invalid product data",
        details: result.error.issues,
      });
      return;
    }

    const product = await updateProduct(req.params.id as string, result.data);
    sendSuccess(res, product);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await deleteProduct(req.params.id as string);
    res.status(204).send();
  }),
);

export default router;
