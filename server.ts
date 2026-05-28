import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // AI Cloner URL Analysis & Generation endpoint
  app.post("/api/clone", async (req, res) => {
    try {
      const { url, description, tone, refineStyle } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      if (!ai) {
        return res.status(500).json({
          error: "Gemini API key is not configured in secrets. Please set GEMINI_API_KEY.",
        });
      }

      // We instruct Gemini to act as an elite landing page designer and conversion optimizer
      const prompt = `
        You are an elite, custom direct-response landing page designer & conversion rate optimization (CRO) copywriter.
        Your task is to analyze the following landing page URL or topic details:
        URL/link to inspire: "${url}"
        Additional business topic or notes: "${description || "None provided"}"
        Copywriting tone: "${tone || "Dynamic Startup Hook"}"
        Design theme requested: "${refineStyle || "Modern Immersive Dark"}"

        Based on standard web architecture, user experience vectors, high-ticket CTA principles, and conversion patterns, generate a similar, inspired landing page representation in JSON matching our LandingPage design spec.
        
        DO NOT copy design blocks verbatim. Build a highly responsive, modern, cleaner, and better version.
        
        Ensure that the generated page contains:
        1. A responsive navigation HEADER (with professional logo name, navigation links [Features, Pricing, FAQ], and an action button)
        2. A HERO section (with key badge, optimized headline copywriting, engaging subheadline, main conversion CTA text, direct visual layout image url [use high-quality, authentic Unsplash marketing templates or visual image links, or default to nice conceptual placeholders], and a checklist of 3 core vectors)
        3. A FEATURES grid (with 3-4 feature items. Each item must have: id, unique short title, description, and an icon matching Lucide names, e.g. "Zap", "Layers", "Globe", "Activity", "Layers", "Shield", "Users", "Cpu")
        4. A BENEFITS checklist (with 3 metric items like numbers, steps, or ROI boosts, e.g., "Step 1", "+300% ROI", "24/7", with short descriptions)
        5. A TESTIMONIALS block (with 2 realistic marketer feedback entries, with name, avatar, rating: 5, quote, role)
        6. A PRICING checklist (with exactly 2 clear options with real pricing, descriptions, active bullet list, and popular flag)
        7. A conversion-saver FAQ structure (with 3-4 standard, reassuring Q&A listings)
        8. A countdown CTA_URGENCY block (with dynamic warning countdown background text, headline, and scarcity tag)
        9. A CONTACT_FORM section (with custom inputs for collecting visitor email name/role values dynamically)
        10. A FOOTER (with a proper copyright, brand logo, disclaimers, and links)

        Select an elegant fontFamily from 'sans', 'serif', 'mono'.
        Conform the colorPalette strictly to a beautiful dark glassmorphic design supporting our Immersive UI theme:
        - primaryBg should be a gorgeous rich dark background like "bg-slate-950" or "bg-stone-950" or "bg-zinc-950"
        - accent should be a bright glowing contrast value like "purple-500" or "blue-500" or "emerald-500"
        - accentGradient should be rich (e.g., "from-violet-600 to-indigo-600" or "from-blue-600 to-fuchsia-600")
        - textPrimary: "text-white"
        - textSecondary: "text-slate-400"
        - cardBg: a glossy glass-card (e.g. "bg-white/[0.03]")
        - border: "border-white/[0.08]"

        Ensure ALL content is descriptive, conversion-optimized, and free of placeholder templates. Return only the requested JSON layout.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Brand title for the page" },
              description: { type: Type.STRING, description: "Pitch or brief description of the generated template" },
              fontFamily: { type: Type.STRING, description: "font family theme: 'sans', 'serif' or 'mono'" },
              colorPalette: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  primaryBg: { type: Type.STRING, description: "e.g., bg-slate-950" },
                  accent: { type: Type.STRING, description: "e.g., violet-500" },
                  accentGradient: { type: Type.STRING, description: "e.g., from-violet-600 to-indigo-600" },
                  textPrimary: { type: Type.STRING, description: "e.g., text-white" },
                  textSecondary: { type: Type.STRING, description: "e.g., text-slate-400" },
                  cardBg: { type: Type.STRING, description: "e.g., bg-slate-900/60" },
                  border: { type: Type.STRING, description: "e.g., border-slate-800/80" },
                },
                required: ["name", "primaryBg", "accent", "accentGradient", "textPrimary", "textSecondary", "cardBg", "border"],
              },
              sections: {
                type: Type.ARRAY,
                description: "Array of modules representing the sections of the page",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    isVisible: { type: Type.BOOLEAN },
                    content: {
                      type: Type.OBJECT,
                      description: "Sub-data for this section type",
                    },
                  },
                  required: ["id", "type", "isVisible", "content"],
                },
              },
            },
            required: ["title", "description", "fontFamily", "colorPalette", "sections"],
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : "{}";
      const parsedData = JSON.parse(jsonText);

      // Enhance sections with clean IDs & structured types
      const sections = (parsedData.sections || []).map((sec: any, idx: number) => {
        return {
          id: sec.id || `sec-${sec.type.toLowerCase()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
          type: sec.type,
          isVisible: sec.isVisible !== false,
          content: sec.content,
        };
      });

      const pageResult = {
        id: "clone-" + Math.random().toString(36).substr(2, 9),
        title: parsedData.title || "Inspired Modern Landing Page",
        description: parsedData.description || "Generated and optimized by Lander.ai",
        slug: parsedData.title ? parsedData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "new-landing-page",
        sourceUrl: url,
        createdAt: new Date().toISOString(),
        colorPalette: parsedData.colorPalette,
        fontFamily: parsedData.fontFamily || "sans",
        sections,
        published: false,
      };

      res.json({ success: true, page: pageResult });
    } catch (err: any) {
      console.error("Cloning engine error:", err);
      res.status(500).json({ error: "Failed to generate cloned landing page. Please try again.", details: err.message });
    }
  });

  // AI Headline & Copy pitch generation endpoint
  app.post("/api/headline", async (req, res) => {
    try {
      const { topic, audience, style } = req.body;
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const prompt = `
        You are a conversion optimization consultant. Generate 5 highly punchy, ultra-converting landing page headlines and matched engaging subheadlines for:
        Product Service Niche: "${topic}"
        Audience: "${audience || "General digital visitors"}"
        Style Tone Preference: "${style || "Direct Response Hook"}"

        Return a JSON array of objects with 'headline' and 'subheadline' keys. Avoid generic slogans; make them raw, emotional, and benefit-focused.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
              },
              required: ["headline", "subheadline"],
            },
          },
        },
      });

      const result = JSON.parse(response.text?.trim() || "[]");
      res.json({ success: true, options: result });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate suggestions", details: err.message });
    }
  });

  // AI Copywriter Rewrite endpoint
  app.post("/api/rewrite", async (req, res) => {
    try {
      const { sectionType, originalContent, tone } = req.body;
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const prompt = `
        You are a world-class COPYWRITER and CRO (Conversion Rate Optimization) specialist.
        Take the following JSON dataset for a landing page section of type "${sectionType}" and rewrite ALL copywriting fields (titles, headers, buttons, bodies, features list, bullet items, pricing details, tags) to look far more compelling, high-converting, and emotionally persuasive.
        
        Keep the tone strictly aligned to: "${tone || "Direct persistence, benefit-driven"}"
        
        Return ONLY the rewritten section JSON of the exact same properties structure. Do not skip any key or shrink fields.
        
        Original JSON to rewrite:
        ${JSON.stringify(originalContent, null, 2)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rewritten = JSON.parse(response.text?.trim() || "{}");
      res.json({ success: true, content: rewritten });
    } catch (err: any) {
      console.error("Rewrite error:", err);
      res.status(500).json({ error: "Persuasion rewrite failed.", details: err.message });
    }
  });

  // Client preview endpoints / assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lander.ai Master Dev Server starts gracefully on port ${PORT}`);
  });
}

startServer();
