#!/usr/bin/env node
/**
 * Generate a single stylized editorial portrait via OpenRouter.
 *
 * Usage:
 *   node scripts/generate-portrait.mjs <output.png> "<style prompt>" [referenceImageUrl]
 *
 * The reference image URL, when given, must be a freely licensed photo
 * (CC0 / CC BY / CC BY-SA / GODL-India — e.g. from Wikimedia Commons).
 * Requires OPENROUTER_API_KEY in the environment or in a .env file at repo root.
 */
import { generatePortrait } from "./lib/openrouter.mjs";

const [output, prompt, refUrl] = process.argv.slice(2);
if (!output || !prompt) {
  console.error('Usage: node scripts/generate-portrait.mjs <output.png> "<prompt>" [refImageUrl]');
  process.exit(1);
}

try {
  await generatePortrait(output, prompt, refUrl);
  console.log("saved", output);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
