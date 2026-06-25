import { Router } from "express";

import { createProduct } from "../controller/productController";

export const productRouter: Router = Router();

productRouter.route("/").post(createProduct);
