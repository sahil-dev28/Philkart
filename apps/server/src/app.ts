import { env } from "@philkart/env/server";
import cors from "cors";
import express from "express";

import { connectDB } from "./db/connect";
import { categoryRouter } from "./routes/categoryRoutes";
import { productRouter } from "./routes/productRoutes";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);

const port = Number(process.env.PORT) || 8001;

const start = async () => {
  try {
    await connectDB(env.DATABASE_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Server could not start with error: ${message}`);
  }
};

start();
