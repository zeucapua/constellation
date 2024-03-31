import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), db(), icon()],
  vite: {
    optimizeDeps: {
      exclude: ["astro:db"]
    }
  },
  adapter: vercel()
});