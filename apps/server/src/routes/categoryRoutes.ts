import { Router } from "express";

import {
  createCategory,
  getCategories,
} from "../controller/categoryController";
import { validateData } from "../middleware/validationMiddleware";
import { createCategorySchema } from "../schema/category";

export const categoryRouter: Router = Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(validateData(createCategorySchema), createCategory);
