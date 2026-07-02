// DATUM token guard — fails if the Signal-Orange acid is hardcoded anywhere outside the
// token layer. Use text-signal / bg-signal / border-signal or var(--signal) instead.
// Legitimate exceptions (no CSS-var access / GPU color): tokens.css, global-error.tsx
// (self-contained fallback document), signal-field.tsx (WebGL material color).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";
const SIGNAL = /#(ff4a1c|ff6a3d|a62a06|8a2405|e23a10)/i;
const ALLOW = ["styles/tokens.css", "global-error.tsx", "signal-field.tsx"];

const violations = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!/\.(tsx?|css)$/.test(name)) continue;
    if (ALLOW.some((a) => p.endsWith(a))) continue;
    const lines = readFileSync(p, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (SIGNAL.test(line)) violations.push(`  ${p}:${i + 1}  ${line.trim()}`);
    });
  }
}

walk(ROOT);

if (violations.length > 0) {
  console.error(
    "✗ tokens: raw Signal-Orange hex found outside tokens.css — use text-signal / bg-signal / var(--signal):",
  );
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("✓ tokens: no raw Signal-Orange hex outside the token layer");
