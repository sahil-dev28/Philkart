import { Router } from "express";
import { createProducts } from "@/utils/createProduct";
import { createProduct } from "../controller/productController";
import { validateData } from "../middleware/validationMiddleware";

import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createProductSchema } from "@/schema/product";

export const productRouter: Router = Router();

productRouter.route("/").post(validateData(createProductSchema), createProduct);
// productRouter.route("/").get(async (req, res) => {
//   const products = await createProducts(100000);
//   res.status(200).json({
//     products,
//   });
// });

productRouter.route("/").get(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await pipeline(Readable.from(createProducts(100000)), res);
});
