import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    app: "./src/app.ts",
    "worker/worker-product": "./src/worker/worker-product.ts",
  },
  format: "esm",
  outDir: "./dist",
  clean: true,
  noExternal: [/@philkart\/.*/],
});
