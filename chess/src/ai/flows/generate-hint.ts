import { genkit } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  fen: z.string(),
  legalMoves: z.array(z.string()),
});

export type GenerateHintInput = z.infer<typeof InputSchema>;
export type GenerateHintOutput = { move: string; explanation: string };

export async function generateHint(
  input: GenerateHintInput
): Promise<GenerateHintOutput> {
  const parsed = InputSchema.parse(input);

  try {
    const prompt = `You are a chess coach. Given FEN ${parsed.fen}, suggest one strong move from the legal set: ${parsed.legalMoves.join(
      ", "
    )}. Respond with JSON having keys move (uci) and explanation (one sentence).`;
    const model = genkit.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedJson = JSON.parse(jsonMatch[0]);
      if (typeof parsedJson.move === "string" && typeof parsedJson.explanation === "string") {
        return { move: parsedJson.move, explanation: parsedJson.explanation };
      }
    }
    // fallback parse: first token and remainder
    const tokens = text.trim().split(/\s+/);
    const move = tokens[0].toLowerCase();
    const explanation = text.substring(tokens[0].length).trim() || "Try improving piece activity.";
    return { move, explanation };
  } catch {
    const move = parsed.legalMoves[Math.floor(Math.random() * parsed.legalMoves.length)] ?? "";
    return { move, explanation: "Random fallback due to AI error." };
  }
}
