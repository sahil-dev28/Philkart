import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

export function validateData<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      }));

      res.status(400).json({ error: details[0]?.message });
      return;
    }

    // Replace body with the parsed (typed + stripped) data for downstream handlers.
    req.body = result.data;
    next();
  };
}
