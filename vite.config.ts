import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import { sri } from "vite-plugin-sri3";
import { externalSRI } from "./vite-plugins/vite-plugin-external-sri";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Add Subresource Integrity (SRI) hashes to bundled scripts and stylesheets
    // This ensures that fetched resources haven't been tampered with
    // Uses SHA-384 algorithm by default for optimal security/performance balance
    sri({ ignoreMissingAsset: false }),
    // Add SRI to external scripts (e.g., Lovable platform scripts)
    // Note: When external scripts are added to index.html with known hashes,
    // add their patterns and hashes here. The ~flock.js script from Lovable
    // is dynamically injected at runtime and needs to be handled by the platform.
    // To generate a hash: node scripts/generate-sri-hash.mjs <url>
    externalSRI({
      scripts: {
        // Add external script patterns and their SRI hashes here
        // Example: '~flock.js': 'sha384-...',
        // Example: 'https://cdn.example.com/analytics.js': 'sha384-...',
      },
      addCrossOrigin: true,
      verbose: mode === "development",
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
