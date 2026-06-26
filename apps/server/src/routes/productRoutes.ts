import { Router } from "express";
import {
  createProductsWithPromise,
  createProductsWithStreaming,
  createProductWithWorker,
} from "@/utils/createProduct";
import { createProduct } from "../controller/productController";
import { validateData } from "../middleware/validationMiddleware";

import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createProductSchema } from "@/schema/product";

export const productRouter: Router = Router();

productRouter.route("/").post(validateData(createProductSchema), createProduct);
productRouter.route("/promise").get(async (_req, res) => {
  const products = await createProductsWithPromise(100000);
  res.status(200).json({
    products,
  });
});

productRouter.route("/streaming").get(async (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    await pipeline(Readable.from(createProductsWithStreaming(10000)), res);
  } catch {
    if (!res.headersSent) res.status(500).end();
    // else: stream already started, let pipeline clean up the streams
  }
});

productRouter.route("/worker").get(async (_req, res) => {
  const products = await createProductWithWorker();
  res.status(200).json({
    products,
  });
});
