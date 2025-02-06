import { defineConfig } from "@umijs/max";

export default defineConfig({
  codeSplitting: {
    jsStrategy: "granularChunks",
  },
  devtool: process.env.NODE_ENV === "development" ? "source-map" : false,
  routes: [
    { path: "/", component: "index" },
    {
      path: "/pragmatic-dnd/tutorial",
      component: "@/pages/pragmatic-dnd/tutorial",
      layout: false,
    },
    {
      path: "/pragmatic-dnd/swap",
      component: "@/pages/pragmatic-dnd/swap",
      layout: false,
    },
    {
      path: "/dnd-kit/tutorial",
      component: "@/pages/dnd-kit/tutorial",
      layout: false,
    },
    {
      path: "/dnd-kit/swap",
      component: "@/pages/dnd-kit/swap",
      layout: false,
    },
    {
      path: "/zoom-pan-pinch/swap",
      component: "@/pages/zoom-pan-pinch/swap",
      layout: false,
    },
    {
      path: "/dnd-kit/drag-overlay",
      component: "@/pages/dnd-kit/drag-overlay",
    },
  ],
  tailwindcss: {},
});
