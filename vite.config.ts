import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import sri from "vite-plugin-sri-gen";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    /**
     * Subresource Integrity (SRI) plugin for production builds.
     * - Generates SHA-384 hashes for all bundled JS and CSS assets
     * - Adds integrity and crossorigin="anonymous" attributes to script/link tags
     * - Only runs during build (not dev server) as SRI doesn't work with HMR
     * - Supports lazy-loaded chunks via modulepreload with integrity
     *
     * Note: flock.js is a Lovable platform-injected script that may be added
     * at deployment time. If the platform doesn't inject SRI attributes for it,
     * it can be skipped using the skipResources option, or a CSP header can be
     * used as an alternative security measure.
     */
    command === "build" &&
      sri({
        algorithm: "sha384",
        crossorigin: "anonymous",
        fetchCache: true,
        fetchTimeoutMs: 5000,
        preloadDynamicChunks: true,
        runtimePatchDynamicLinks: true,
        // Skip external platform-injected scripts if they cause issues
        // skipResources: ["~flock.js"],
      }),
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
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy for optimal code splitting:
         * - vendor-react: Core React runtime (shared across all routes)
         * - vendor-router: Routing library (shared across all routes)
         * - vendor-radix: Radix UI primitives (shared by shadcn/ui components)
         * - vendor-utils: Utility libraries like clsx, tailwind-merge (shared by UI components)
         * - vendor-query: TanStack Query (loaded with app shell, can be deferred if unused)
         *
         * Page components (Index, NotFound) will be automatically split
         * into separate chunks via React.lazy() dynamic imports.
         */
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-radix": [
            "@radix-ui/react-tooltip",
            "@radix-ui/react-slot",
          ],
          "vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-sonner": ["sonner"],
        },
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
  },
}));
