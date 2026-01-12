#!/usr/bin/env node

/**
 * Script to generate SRI (Subresource Integrity) hashes for external scripts
 *
 * Usage:
 *   node scripts/generate-sri-hash.mjs <url>
 *   node scripts/generate-sri-hash.mjs https://example.com/script.js
 *
 * This will output a hash suitable for use in the integrity attribute:
 *   sha384-base64EncodedHash
 */

import { createHash } from "crypto";
import { argv, exit } from "process";

const ALGORITHMS = ["sha384", "sha512", "sha256"];

async function fetchScript(url) {
  console.log(`Fetching: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function generateHash(content, algorithm = "sha384") {
  const hash = createHash(algorithm);
  hash.update(content, "utf8");
  const base64Hash = hash.digest("base64");
  return `${algorithm}-${base64Hash}`;
}

async function main() {
  const url = argv[2];
  const algorithm = argv[3] || "sha384";

  if (!url) {
    console.log("Usage: node scripts/generate-sri-hash.mjs <url> [algorithm]");
    console.log("");
    console.log("Arguments:");
    console.log("  url        The URL of the external script");
    console.log("  algorithm  Hash algorithm: sha256, sha384 (default), or sha512");
    console.log("");
    console.log("Example:");
    console.log("  node scripts/generate-sri-hash.mjs https://cdn.example.com/script.js");
    console.log("  node scripts/generate-sri-hash.mjs https://cdn.example.com/script.js sha512");
    exit(1);
  }

  if (!ALGORITHMS.includes(algorithm)) {
    console.error(`Invalid algorithm: ${algorithm}`);
    console.error(`Valid algorithms: ${ALGORITHMS.join(", ")}`);
    exit(1);
  }

  try {
    const content = await fetchScript(url);
    const hash = generateHash(content, algorithm);

    console.log("");
    console.log("SRI Hash Generated:");
    console.log("-------------------");
    console.log(`URL: ${url}`);
    console.log(`Algorithm: ${algorithm}`);
    console.log(`Hash: ${hash}`);
    console.log("");
    console.log("Usage in HTML:");
    console.log(`<script src="${url}" integrity="${hash}" crossorigin="anonymous"></script>`);
    console.log("");
    console.log("Usage in vite-plugin-external-sri:");
    console.log(`scripts: {`);
    console.log(`  '${url}': '${hash}'`);
    console.log(`}`);
  } catch (error) {
    console.error("Error:", error.message);
    exit(1);
  }
}

main();
