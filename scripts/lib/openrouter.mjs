import { readFileSync, writeFileSync, existsSync } from "node:fs";

const MODEL = "google/gemini-3-pro-image-preview";

export function loadKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  if (existsSync(".env")) {
    const m = readFileSync(".env", "utf8").match(/OPENROUTER_API_KEY=([^\s#]+)/);
    if (m) return m[1];
  }
  throw new Error("OPENROUTER_API_KEY not found in environment or .env");
}

export function housePrompt(person, hasRef) {
  const base = `Create a dignified painterly editorial magazine illustration${hasRef ? " based on this reference photo" : ""} of ${person}: 16:10 landscape composition, visible oil-paint brushstrokes, warm earthy palette with saffron and terracotta accents, soft flat muted background, clearly an artistic hand-painted illustration rather than a photograph. Absolutely no text, words, lettering, titles, captions or watermarks anywhere in the image.`;
  return hasRef
    ? base + " Preserve the person's facial likeness but do not copy the photo's composition, framing or background — create an original artwork informed by it."
    : base + " Do not attempt a specific real person's likeness; depict the scene and role evocatively.";
}

export async function generatePortrait(output, prompt, refUrl) {
  const content = [{ type: "text", text: prompt }];
  if (refUrl) {
    const res = await fetch(refUrl, {
      headers: { "User-Agent": "MPLuminaries/1.0 (editorial illustration reference)" },
    });
    if (!res.ok) throw new Error(`Failed to fetch reference image (${res.status}): ${refUrl}`);
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
      max_tokens: Number(process.env.OPENROUTER_MAX_TOKENS || 8192),
      messages: [{ role: "user", content }],
    }),
  });
  if (!resp.ok) throw new Error(`OpenRouter error ${resp.status}: ${await resp.text()}`);

  const data = await resp.json();
  const img = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!img || !img.startsWith("data:image")) {
    throw new Error("No image in response: " + JSON.stringify(data).slice(0, 800));
  }
  writeFileSync(output, Buffer.from(img.split(",")[1], "base64"));
  return output;
}
