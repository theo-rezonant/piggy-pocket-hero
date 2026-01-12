/**
 * Subresource Integrity (SRI) utilities for external scripts
 *
 * This module provides utilities for loading external scripts with SRI verification.
 * It helps ensure that external resources haven't been tampered with by verifying
 * their cryptographic hashes before execution.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
 */

export interface ExternalScriptConfig {
  src: string;
  integrity?: string;
  crossOrigin?: "anonymous" | "use-credentials";
  async?: boolean;
  defer?: boolean;
  type?: "module" | "text/javascript";
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Known external scripts with their SRI hashes
 *
 * Note: The ~flock.js script from Lovable platform is dynamically injected
 * and its hash may change with platform updates. This hash should be updated
 * when the Lovable platform is updated.
 *
 * To regenerate the hash, use:
 * curl -s [URL] | openssl dgst -sha384 -binary | openssl base64 -A
 */
export const KNOWN_EXTERNAL_SCRIPTS: Record<string, string> = {
  // Add known external scripts and their SRI hashes here
  // Example: "https://cdn.example.com/script.js": "sha384-hash-value-here"
};

/**
 * Loads an external script with optional SRI verification
 *
 * @param config - Configuration for the external script
 * @returns Promise that resolves when the script loads successfully
 *
 * @example
 * ```ts
 * await loadExternalScript({
 *   src: "https://cdn.example.com/script.js",
 *   integrity: "sha384-...",
 *   crossOrigin: "anonymous"
 * });
 * ```
 */
export function loadExternalScript(config: ExternalScriptConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = config.src;

    // Set SRI attributes if integrity hash is provided
    if (config.integrity) {
      script.integrity = config.integrity;
      // crossorigin is required when using integrity attribute
      script.crossOrigin = config.crossOrigin ?? "anonymous";
    } else if (config.crossOrigin) {
      script.crossOrigin = config.crossOrigin;
    }

    if (config.async !== undefined) {
      script.async = config.async;
    }

    if (config.defer !== undefined) {
      script.defer = config.defer;
    }

    if (config.type) {
      script.type = config.type;
    }

    script.onload = () => {
      config.onLoad?.();
      resolve();
    };

    script.onerror = () => {
      const error = new Error(
        `Failed to load external script: ${config.src}. ` +
        (config.integrity ? "This may be due to an SRI integrity mismatch." : "")
      );
      config.onError?.(error);
      reject(error);
    };

    document.head.appendChild(script);
  });
}

/**
 * Loads multiple external scripts in sequence
 *
 * @param configs - Array of script configurations
 * @returns Promise that resolves when all scripts are loaded
 */
export async function loadExternalScripts(
  configs: ExternalScriptConfig[]
): Promise<void> {
  for (const config of configs) {
    await loadExternalScript(config);
  }
}

/**
 * Loads multiple external scripts in parallel
 *
 * @param configs - Array of script configurations
 * @returns Promise that resolves when all scripts are loaded
 */
export function loadExternalScriptsParallel(
  configs: ExternalScriptConfig[]
): Promise<void[]> {
  return Promise.all(configs.map(loadExternalScript));
}

/**
 * Generates an SRI hash for a given content string
 *
 * Note: This is typically done server-side or at build time.
 * For runtime hash generation, use the Web Crypto API.
 *
 * @param content - The content to hash
 * @param algorithm - The hash algorithm (default: SHA-384)
 * @returns Promise with the SRI hash string
 */
export async function generateSRIHash(
  content: string,
  algorithm: "sha256" | "sha384" | "sha512" = "sha384"
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  const algorithmMap = {
    sha256: "SHA-256",
    sha384: "SHA-384",
    sha512: "SHA-512",
  };

  const hashBuffer = await crypto.subtle.digest(algorithmMap[algorithm], data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return `${algorithm}-${hashBase64}`;
}

/**
 * Verifies that a script's content matches its expected SRI hash
 *
 * @param content - The script content to verify
 * @param expectedHash - The expected SRI hash (e.g., "sha384-...")
 * @returns Promise that resolves to true if the hash matches
 */
export async function verifySRIHash(
  content: string,
  expectedHash: string
): Promise<boolean> {
  const [algorithm] = expectedHash.split("-") as ["sha256" | "sha384" | "sha512"];
  const computedHash = await generateSRIHash(content, algorithm);
  return computedHash === expectedHash;
}
