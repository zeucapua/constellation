import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), db()],
  vite: {
    optimizeDeps: {
      exclude: ["astro:db"]
    }
  },
  adapter: vercel()
});