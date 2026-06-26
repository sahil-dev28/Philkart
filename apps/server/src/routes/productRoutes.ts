import { Router } from "express";
import { createProducts } from "@/utils/createProduct";
import { createProduct } from "../controller/productController";
import { validateData } from "../middleware/validationMiddleware";
import { createProductSchema } from "../schema/product";

export const productRouter: Router = Router();

productRouter.route("/").post(validateData(createProductSchema), createProduct);
productRouter.route("/").get(async (req, res) => {
  const products = await createProducts(1000000);
  res.status(200).json({
    products,
  });
});
