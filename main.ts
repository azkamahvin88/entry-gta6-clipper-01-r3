// main.ts — entry program for the gta6-clipper-01 r3 submission (revised).
//
// What this little program does, in plain terms: it finds the VIDEO.json
// file that sits next to it in the repo, copies that file into the output
// directory the grader tells us about, and then double-checks that the copy
// is byte-for-byte the same as the original and that the YouTube Shorts URL
// inside it is a real, well-formed link. If anything is off, it complains
// on stderr and exits non-zero; if everything checks out, it says so.
//
// Revision notes (r3 reviser): the URL check no longer trusts a loose
// regex alone — it parses the URL with the WHATWG URL parser and requires
// an https: URL on youtube.com / www.youtube.com with a /shorts/<id> path,
// or on youtu.be with a bare /<id> path, where <id> is exactly 11
// YouTube-ID characters. Placeholder-like values are rejected
// case-insensitively. The copied JSON must also parse to an object with
// exactly one key, "url" — no extra fields, no arrays, no null.
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

// The copy must parse as JSON and be an object with exactly one key, "url".
let data: unknown;
try {
  data = JSON.parse(copy.toString("utf-8"));
} catch (err) {
  console.error(`error: ${targetPath} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof data !== "object" || data === null || Array.isArray(data)) {
  console.error("error: VIDEO.json must be a JSON object, not an array or scalar");
  process.exit(1);
}
const keys = Object.keys(data);
if (keys.length !== 1 || keys[0] !== "url") {
  console.error(
    `error: VIDEO.json must contain exactly one key "url", got: ${JSON.stringify(keys)}`,
  );
  process.exit(1);
}

// The url field has to be a string.
const url = (data as { url?: unknown }).url;
if (typeof url !== "string") {
  console.error("error: VIDEO.json 'url' must be a string");
  process.exit(1);
}

// Reject anything that still looks like a placeholder, in any casing.
// ("example" is deliberately NOT in this list: example.com is already
// rejected by the host check below, and the word could in theory appear
// inside a real 11-character video id.)
const placeholderPattern = /placeholder|todo|your[_-]?url|<\s*url\s*>|xxx+/i;
if (placeholderPattern.test(url)) {
  console.error("error: VIDEO.json 'url' still contains a placeholder");
  process.exit(1);
}

// Strict Shorts URL validation via the URL parser (no loose regex only):
//  - https: only
//  - host youtube.com or www.youtube.com, path /shorts/<11-char id>
//  - or host youtu.be, path /<11-char id>
//  - query string / fragment are allowed but ignored
let videoId: string | null = null;
let parsed: URL;
try {
  parsed = new URL(url);
} catch {
  console.error(`error: VIDEO.json 'url' is not a parseable URL: ${url}`);
  process.exit(1);
}
if (parsed.protocol !== "https:") {
  console.error(`error: VIDEO.json 'url' must use https:, got: ${parsed.protocol}`);
  process.exit(1);
}
const idPattern = /^[A-Za-z0-9_-]{11}$/;
if (parsed.hostname === "youtube.com" || parsed.hostname === "www.youtube.com") {
  const match = /^\/shorts\/([A-Za-z0-9_-]+)\/?$/.exec(parsed.pathname);
  if (!match) {
    console.error(
      `error: VIDEO.json 'url' path must be /shorts/<video-id>: ${url}`,
    );
    process.exit(1);
  }
  videoId = match[1];
} else if (parsed.hostname === "youtu.be") {
  const match = /^\/([A-Za-z0-9_-]+)\/?$/.exec(parsed.pathname);
  if (!match) {
    console.error(
      `error: VIDEO.json 'url' path must be /<video-id> on youtu.be: ${url}`,
    );
    process.exit(1);
  }
  videoId = match[1];
} else {
  console.error(
    `error: VIDEO.json 'url' host must be youtube.com or youtu.be, got: ${parsed.hostname}`,
  );
  process.exit(1);
}
if (!idPattern.test(videoId)) {
  console.error(
    `error: VIDEO.json 'url' video id must be exactly 11 characters, got: ${videoId}`,
  );
  process.exit(1);
}

console.log(
  `ok: wrote ${targetPath} (${copy.length} bytes), URL verified: ${url}`,
);
