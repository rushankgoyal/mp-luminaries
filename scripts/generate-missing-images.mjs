#!/usr/bin/env node
/**
 * Scan src/articles/*.md and generate any missing portrait images.
 *
 * Each article's front matter declares:
 *   image:       /assets/images/<name>.png   (where the file must exist)
 *   imageRef:    optional URL of a freely licensed reference photo
 *   imagePrompt: optional override of the house-style prompt
 *   person:      used to build the default prompt
 *
 * Used by CI (with OPENROUTER_API_KEY as a repo secret) so that the daily
 * publishing agent never needs the key itself. Exits 0 if nothing to do.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { generatePortrait, housePrompt } from "./lib/openrouter.mjs";

const ARTICLES = "src/articles";

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return fm;
}

let failures = 0;
for (const file of readdirSync(ARTICLES).filter((f) => f.endsWith(".md"))) {
  const fm = frontMatter(readFileSync(join(ARTICLES, file), "utf8"));
  if (!fm.image) continue;
  const target = join("src", fm.image);
  if (existsSync(target)) continue;

  const prompt = fm.imagePrompt || housePrompt(fm.person || "the subject", Boolean(fm.imageRef));
  console.log(`generating ${target} (ref: ${fm.imageRef || "none"})`);
  try {
    await generatePortrait(target, prompt, fm.imageRef);
    console.log("  saved");
  } catch (err) {
    failures++;
    console.error(`  FAILED: ${err.message}`);
  }
}
process.exit(failures ? 1 : 0);
