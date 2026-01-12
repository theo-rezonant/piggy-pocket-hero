import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    process.env.ANALYZE === "true" &&
      visualizer({
        filename: "stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification and tree-shaking optimizations
    minify: "esbuild",
    // Improve tree-shaking for production builds
    target: "esnext",
    rollupOptions: {
      output: {
        /**
         * Dynamic chunk splitting based on module path.
         * This function-based approach properly handles dynamically imported modules
         * and creates separate chunks for:
         * - Heavy UI libraries (recharts, embla, cmdk) - lazy loaded
         * - React core libraries
         * - Radix UI primitives
         */
        manualChunks(id) {
          // Heavy UI dependencies get their own chunks for lazy loading
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) {
            return "ui-recharts";
          }
          if (id.includes("node_modules/embla-carousel")) {
            return "ui-embla";
          }
          if (id.includes("node_modules/cmdk")) {
            return "ui-cmdk";
          }

          // React core in its own chunk
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react";
          }

          // React Router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }

          // TanStack Query
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query";
          }

          // Radix UI primitives (commonly used)
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix";
          }

          // Styling utilities (clsx, tailwind-merge, CVA)
          if (
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge") ||
            id.includes("node_modules/class-variance-authority")
          ) {
            return "vendor-utils";
          }
        },
      },
      // Tree-shaking configuration - use recommended preset
      // Note: moduleSideEffects: false can be too aggressive for some libraries
      treeshake: {
        preset: "recommended",
      },
    },
  },
  // Optimize dependency pre-bundling for dev server
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
    ],
  },
}));
