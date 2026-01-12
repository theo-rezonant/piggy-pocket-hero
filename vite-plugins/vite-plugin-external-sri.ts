/**
 * Vite Plugin for External Script SRI
 *
 * This plugin adds Subresource Integrity (SRI) attributes to external script
 * tags in the HTML output. It's designed to handle scripts from CDNs or
 * third-party sources like the Lovable platform.
 *
 * Usage in vite.config.ts:
 * ```ts
 * import { externalSRI } from './vite-plugins/vite-plugin-external-sri';
 *
 * export default defineConfig({
 *   plugins: [
 *     externalSRI({
 *       scripts: {
 *         '~flock.js': 'sha384-hash-value-here'
 *       }
 *     })
 *   ]
 * });
 * ```
 */

import type { Plugin } from "vite";

export interface ExternalSRIOptions {
  /**
   * Map of script URL patterns to their SRI hashes
   * Keys can be full URLs or patterns that will be matched against script src
   *
   * Example:
   * {
   *   '~flock.js': 'sha384-...',
   *   'https://cdn.example.com/script.js': 'sha384-...'
   * }
   */
  scripts?: Record<string, string>;

  /**
   * Whether to add crossorigin="anonymous" to scripts with integrity
   * @default true
   */
  addCrossOrigin?: boolean;

  /**
   * Enable verbose logging in development
   * @default false
   */
  verbose?: boolean;
}

/**
 * Creates a Vite plugin that adds SRI attributes to external scripts
 */
export function externalSRI(options: ExternalSRIOptions = {}): Plugin {
  const { scripts = {}, addCrossOrigin = true, verbose = false } = options;

  return {
    name: "vite-plugin-external-sri",
    enforce: "post",

    transformIndexHtml(html: string) {
      if (Object.keys(scripts).length === 0) {
        return html;
      }

      // Regular expression to match script tags
      const scriptRegex = /<script([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;

      return html.replace(scriptRegex, (match, beforeSrc, src, afterSrc) => {
        // Find matching script hash
        const matchingPattern = Object.keys(scripts).find(
          (pattern) => src.includes(pattern) || src === pattern
        );

        if (matchingPattern) {
          const integrity = scripts[matchingPattern];

          if (verbose) {
            console.log(`[external-sri] Adding SRI to: ${src}`);
          }

          // Check if integrity already exists
          if (match.includes("integrity=")) {
            return match;
          }

          // Build the new script tag with integrity
          let attributes = `${beforeSrc}src="${src}"${afterSrc}`;

          // Add integrity attribute
          attributes = attributes.replace(/>$/, "") + ` integrity="${integrity}"`;

          // Add crossorigin if needed and not already present
          if (addCrossOrigin && !match.includes("crossorigin")) {
            attributes += ' crossorigin="anonymous"';
          }

          return `<script${attributes}>`;
        }

        return match;
      });
    },
  };
}

export default externalSRI;
