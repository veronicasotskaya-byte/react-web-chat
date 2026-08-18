import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { ProxyOptions } from "vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const proxyEnv = process.env.PROXY_ENV === "stage" ? "stage" : "local";

const proxy = JSON.parse(
  readFileSync(join(__dirname, `proxies/${proxyEnv}.proxy.json`), "utf-8"),
) as Record<string, ProxyOptions>;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy,
  },
});
