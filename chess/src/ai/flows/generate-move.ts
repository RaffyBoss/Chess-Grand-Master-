import { genkit } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  fen: z.string(),
  legalMoves: z.array(z.string()),
  difficulty: z.number().min(1).max(5),
});

export type GenerateMoveInput = z.infer<typeof InputSchema>;
export type GenerateMoveOutput = { move: string };

export async function generateAIMove(
  input: GenerateMoveInput
): Promise<GenerateMoveOutput> {
  const parsed = InputSchema.parse(input);

  try {
    const prompt = `You are a strong chess engine. Given FEN ${parsed.fen}, choose a strong move from this legal set: ${parsed.legalMoves.join(
      ", "
    )}. Respond ONLY with one move in UCI notation like e2e4. Difficulty: ${
      parsed.difficulty
    }/5.`;

    const model = genkit.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const text = result.response.text().trim();

    // Sanitize response -> UCI move
    const uci = text.split(/\s|\n|\./)[0].replace(/[^a-h1-8qrbnk]/gi, "").toLowerCase();
    if (!parsed.legalMoves.includes(uci)) {
      throw new Error("Model returned illegal move");
    }
    return { move: uci };
  } catch {
    // Fallback: choose a random legal move
    const move = parsed.legalMoves[Math.floor(Math.random() * parsed.legalMoves.length)] ?? "";
    return { move };
  }
}
