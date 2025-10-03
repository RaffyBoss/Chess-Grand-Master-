import { GoogleGenerativeAI } from "@google/generative-ai";

// Minimal wrapper that emulates the Genkit client's getGenerativeModel API
const apiKey =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_API_KEY ||
  "";

const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const genkit = {
  getGenerativeModel({ model }: { model: string }) {
    if (!client) {
      throw new Error("Missing Google Generative AI API key (set GOOGLE_API_KEY or GOOGLE_AI_API_KEY)");
    }
    const m = client.getGenerativeModel({ model });
    return {
      generateContent: (req: { contents: Array<{ role: string; parts: Array<{ text: string }> }> }) =>
        m.generateContent(req as unknown as Parameters<typeof m.generateContent>[0]),
    } as const;
  },
};
