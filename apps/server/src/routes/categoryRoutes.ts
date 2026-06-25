import { Router } from "express";

import { createCategory } from "../controller/categoryController";
import { validateData } from "../middleware/validationMiddleware";
import { createCategorySchema } from "../schema/category";

export const categoryRouter: Router = Router();

categoryRouter
  .route("/")
  .post(validateData(createCategorySchema), createCategory);
