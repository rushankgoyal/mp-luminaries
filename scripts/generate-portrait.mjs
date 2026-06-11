#!/usr/bin/env node
/**
 * Generate a stylized editorial portrait via OpenRouter (Gemini image model).
 *
 * Usage:
 *   node scripts/generate-portrait.mjs <output.png> "<style prompt>" [referenceImageUrl]
 *
 * The reference image URL, when given, must be a freely licensed photo
 * (CC0 / CC BY / CC BY-SA / GODL-India — e.g. from Wikimedia Commons).
 * The model is instructed to produce an artistic illustration that preserves
 * likeness without copying the photograph.
 *
 * Requires OPENROUTER_API_KEY in the environment or in a .env file at repo root.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const MODEL = "google/gemini-3-pro-image-preview";

function loadKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  if (existsSync(".env")) {
    const m = readFileSync(".env", "utf8").match(/OPENROUTER_API_KEY=([^\s#]+)/);
    if (m) return m[1];
  }
  console.error("OPENROUTER_API_KEY not found in environment or .env");
  process.exit(1);
}

const [output, prompt, refUrl] = process.argv.slice(2);
if (!output || !prompt) {
  console.error('Usage: node scripts/generate-portrait.mjs <output.png> "<prompt>" [refImageUrl]');
  process.exit(1);
}

const content = [{ type: "text", text: prompt }];
if (refUrl) {
  const res = await fetch(refUrl, { headers: { "User-Agent": "MPLuminaries/1.0 (editorial illustration reference)" } });
  if (!res.ok) {
    console.error(`Failed to fetch reference image (${res.status}): ${refUrl}`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get("content-type")?.split(";")[0] || "image/jpeg";
  content.push({ type: "image_url", image_url: { url: `data:${mime};base64,${buf.toString("base64")}` } });
}

const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${loadKey()}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: MODEL,
    modalities: ["image", "text"],
    messages: [{ role: "user", content }],
  }),
});

if (!resp.ok) {
  console.error(`OpenRouter error ${resp.status}: ${await resp.text()}`);
  process.exit(1);
}

const data = await resp.json();
const img = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
if (!img || !img.startsWith("data:image")) {
  console.error("No image in response:", JSON.stringify(data).slice(0, 800));
  process.exit(1);
}
writeFileSync(output, Buffer.from(img.split(",")[1], "base64"));
console.log("saved", output);
