import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig(() => {
  const analyze = process.env.ANALYZE === "true"

  return {
    plugins: [
      react(),
      tailwindcss(),
      analyze &&
        visualizer({
          filename: "dist/bundle-analysis.json",
          template: "raw-data",
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replaceAll("\\", "/")
            if (!normalizedId.includes("node_modules")) return

            if (normalizedId.includes("/node_modules/firebase/")) return "firebase"
            if (normalizedId.includes("/node_modules/@tanstack/react-query/")) return "react-query"
            if (
              normalizedId.includes("/node_modules/react-router-dom/") ||
              normalizedId.includes("/node_modules/react-dom/") ||
              normalizedId.includes("/node_modules/react/")
            ) {
              return "react-vendor"
            }
            if (normalizedId.includes("/node_modules/radix-ui/")) return "radix"
            if (normalizedId.includes("/node_modules/lucide-react/")) return "icons"
            if (normalizedId.includes("/node_modules/sileo/")) return "sileo"
          },
        },
      },
    },
  }
})
