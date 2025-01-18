import { defineConfig } from "@umijs/max";

export default defineConfig({
  codeSplitting: {
    jsStrategy: "granularChunks",
  },
  devtool: process.env.NODE_ENV === "development" ? "source-map" : false,
  tailwindcss: {},
});
