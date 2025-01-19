import { defineConfig } from "@umijs/max";

export default defineConfig({
  codeSplitting: {
    jsStrategy: "granularChunks",
  },
  devtool: process.env.NODE_ENV === "development" ? "source-map" : false,
  routes: [
    { path: "/", component: "index" },
    { path: "/tutorial", component: "@/pages/tutorial", layout: false },
    { path: "/swap", component: "@/pages/swap", layout: false },
  ],
  tailwindcss: {},
});
