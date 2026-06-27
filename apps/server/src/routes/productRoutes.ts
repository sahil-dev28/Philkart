import { Router } from "express";

import { createProductSchema } from "@/schema/product";

import {
  createProduct,
  generateProductsBuffered,
  generateProductsParallel,
  streamProducts,
} from "../controller/productController";
import { validateData } from "../middleware/validationMiddleware";

export const productRouter: Router = Router();

productRouter.route("/").post(validateData(createProductSchema), createProduct);

// Route with promise
productRouter.route("/promise").get(generateProductsBuffered);

// Route with streaming
productRouter.route("/streaming").get(streamProducts);

// Route with worker thread
productRouter.route("/worker").get(generateProductsParallel);
