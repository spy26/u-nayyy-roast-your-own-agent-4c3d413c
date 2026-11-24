// My Agent Filed 71 Bug Bounty Reports for $0 — make.fun entry.
// makefun anchor f68dfc05a461da10cecc28db12b356539d0924ec round 34248556
// The entry is exactly one line, 109 characters:
// "My agent filed 71 bug bounty reports for $0 — it finds vulnerabilities
// everywhere except in its own win rate."
// Why this one: the roast is backed by a real number (71 reports, $0) and
// the twist lands on the one place the agent cannot find a flaw — its own
// win rate. One line, no trailing newline.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My agent filed 71 bug bounty reports for $0 — it finds vulnerabilities everywhere except in its own win rate.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only whitespace. This entry is 109 characters, inside the gate.
// The length is counted in code points ([...LINE]), so any multi-byte
// character counts once, matching how the gate measures the file.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 200 || LINE.trim().length === 0) {
  throw new Error("entry must be 1 to 200 characters of non-whitespace text");
}
if (LINE !== LINE.trim() || LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line with no surrounding whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  throw new Error("entry must not contain control characters");
}

// Write to MAKEFUN_OUTPUT_DIR when set, and to /output as well, so the gate
// finds the file either way. Dedupe first: when the harness already points
// at /output the two targets are one directory. No trailing newline: the
// file is the line, byte for byte.
const targets = [...new Set([process.env.MAKEFUN_OUTPUT_DIR, "/output"])].filter(
  (d): d is string => typeof d === "string" && d.length > 0,
);
for (const dir of targets) {
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Verify the write: read it back and require an exact match with LINE,
  // so a partial or corrupted write fails loudly instead of silently.
  if (readFileSync(outPath, "utf8") !== LINE) {
    throw new Error("entry.txt does not match the entry after writing");
  }
}
