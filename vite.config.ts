import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isSingle = mode === "single"
  const singleHandbook = process.env.HANDBOOK ?? ""

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: !isSingle,
        routesDirectory: "./src/routes",
        generatedRouteTree: "./src/routeTree.gen.ts",
      }),
      react(),
      tailwindcss(),
      ...(isSingle ? [viteSingleFile()] : []),
    ],
    define: {
      __SINGLE_HANDBOOK__: JSON.stringify(isSingle ? singleHandbook : ""),
    },
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "./src"),
      },
    },
    build: {
      assetsInlineLimit: isSingle ? Number.MAX_SAFE_INTEGER : 4096,
    },
  }
})
