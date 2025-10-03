import { NextResponse } from "next/server";
import { Chess } from "chess.js";
import { generateAIMove } from "@/ai/flows/generate-move";

export async function POST(req: Request) {
  try {
    const { fen, difficulty } = await req.json();
    const chess = new Chess(fen);
    const legal = chess.moves({ verbose: true }).map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
    const { move } = await generateAIMove({ fen, legalMoves: legal, difficulty });
    const promotion = move.length > 4 ? (move[4] as "q" | "r" | "b" | "n") : undefined;
    const mv = chess.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion });
    if (!mv) return NextResponse.json({ error: "invalid move" }, { status: 400 });
    const promo = (mv.promotion && ["q","r","b","n"].includes(mv.promotion as string)) ? (mv.promotion as "q" | "r" | "b" | "n") : undefined;
    return NextResponse.json({ from: mv.from, to: mv.to, promotion: promo, san: mv.san });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
