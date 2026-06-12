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
  // Stories created without an explicit image path (e.g. via the editor
  // portal) get the same default the site templates compute.
  const image = fm.image || `/assets/images/${file.replace(/\.md$/, "")}.png`;
  const target = join("src", image);
  if (existsSync(target)) continue;

  console.log(`generating ${target} (ref: ${fm.imageRef || "none"})`);
  try {
    const prompt = fm.imagePrompt || housePrompt(fm.person || "the subject", Boolean(fm.imageRef));
    await generatePortrait(target, prompt, fm.imageRef);
    console.log("  saved");
  } catch (err) {
    if (!fm.imageRef) {
      failures++;
      console.error(`  FAILED: ${err.message}`);
      continue;
    }
    // A dead or unfetchable reference photo must not block the edition —
    // retry as an evocative no-likeness illustration.
    console.error(`  reference failed (${err.message}); retrying without reference`);
    try {
      const prompt = fm.imagePrompt || housePrompt(fm.person || "the subject", false);
      await generatePortrait(target, prompt);
      console.log("  saved (no reference)");
    } catch (err2) {
      failures++;
      console.error(`  FAILED: ${err2.message}`);
    }
  }
}
// Non-zero exit marks the workflow run red so the failure is visible, but the
// workflow still commits successful images and deploys (see deploy.yml).
process.exit(failures ? 1 : 0);
