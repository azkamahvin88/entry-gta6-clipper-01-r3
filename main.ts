// main.ts — entry program for the gta6-clipper-01 r3 submission.
//
// What this little program does, in plain terms: it finds the VIDEO.json
// file that sits next to it in the repo, copies that file into the output
// directory the grader tells us about, and then double-checks that the copy
// is byte-for-byte the same as the original and that the YouTube Shorts URL
// inside it is a real, well-formed link. If anything is off, it complains
// on stderr and exits non-zero; if everything checks out, it says so.
//
// Node 22, standard library only, no network access, fully deterministic.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Figure out the repo root from where this file itself lives.
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here);
const sourcePath = join(repoRoot, "VIDEO.json");

// The grader must tell us where the output goes.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  console.error("error: MAKEFUN_OUTPUT_DIR environment variable is not set");
  process.exit(1);
}

// Read the original descriptor.
let original: Buffer;
try {
  original = readFileSync(sourcePath);
} catch (err) {
  console.error(`error: cannot read ${sourcePath}: ${(err as Error).message}`);
  process.exit(1);
}

// Make sure the output folder exists, then copy the file into it.
const targetPath = join(resolve(outputDir), "VIDEO.json");
try {
  mkdirSync(resolve(outputDir), { recursive: true });
  copyFileSync(sourcePath, targetPath);
} catch (err) {
  console.error(`error: cannot write ${targetPath}: ${(err as Error).message}`);
  process.exit(1);
}

// Read the copy back and compare it byte-for-byte with the original.
let copy: Buffer;
try {
  copy = readFileSync(targetPath);
} catch (err) {
  console.error(`error: cannot read back ${targetPath}: ${(err as Error).message}`);
  process.exit(1);
}
if (!copy.equals(original)) {
  console.error(
    `error: ${targetPath} differs from ${sourcePath} (byte mismatch)`,
  );
  process.exit(1);
}

// The copy must also parse as JSON.
let data: unknown;
try {
  data = JSON.parse(copy.toString("utf-8"));
} catch (err) {
  console.error(`error: ${targetPath} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

// And the url field has to be a real YouTube Shorts link, not a placeholder.
const url = (data as { url?: unknown } | null)?.url;
const shortsPattern =
  /^https:\/\/(www\.)?youtube\.com\/shorts\/[A-Za-z0-9_-]+(\?.*)?$/;
if (typeof url !== "string") {
  console.error("error: VIDEO.json 'url' must be a string");
  process.exit(1);
}
if (url.includes("PLACEHOLDER")) {
  console.error("error: VIDEO.json 'url' still contains a placeholder");
  process.exit(1);
}
if (!shortsPattern.test(url)) {
  console.error(`error: VIDEO.json 'url' is not a valid YouTube Shorts URL: ${url}`);
  process.exit(1);
}

console.log(
  `ok: wrote ${targetPath} (${copy.length} bytes), URL verified: ${url}`,
);
