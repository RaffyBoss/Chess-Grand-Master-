"use server";

// import { z } from "zod";
import { Chess } from "chess.js";
import { generateAIMove } from "@/ai/flows/generate-move";
import { generateHint } from "@/ai/flows/generate-hint";
import type { GameState, MoveCoords } from "@/lib/types";
// import { cookies } from "next/headers";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApp();
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials in env");
  }
  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const getAiMove = async (
  fen: string,
  difficulty: number
): Promise<MoveCoords> => {
  const chess = new Chess(fen);
  const legal = chess.moves({ verbose: true }).map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
  const { move } = await generateAIMove({ fen, legalMoves: legal, difficulty });
  const promotion = (move.length > 4 ? (move[4] as "q" | "r" | "b" | "n") : undefined);
  const mv = chess.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion });
  if (!mv) throw new Error("AI produced invalid move");
  const promo = (mv.promotion && ["q","r","b","n"].includes(mv.promotion as string)) ? (mv.promotion as "q" | "r" | "b" | "n") : undefined;
  return { from: mv.from, to: mv.to, promotion: promo, san: mv.san };
};

export const getHintAction = async (fen: string): Promise<{ move: MoveCoords; explanation: string }> => {
  const chess = new Chess(fen);
  const legal = chess.moves({ verbose: true }).map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
  const { move, explanation } = await generateHint({ fen, legalMoves: legal });
  const promotion = (move.length > 4 ? (move[4] as "q" | "r" | "b" | "n") : undefined);
  const mv = chess.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion });
  if (!mv) return { move: { from: move.slice(0, 2), to: move.slice(2, 4), promotion }, explanation };
  const promo = (mv.promotion && ["q","r","b","n"].includes(mv.promotion as string)) ? (mv.promotion as "q" | "r" | "b" | "n") : undefined;
  return { move: { from: mv.from, to: mv.to, promotion: promo, san: mv.san }, explanation };
};

// const SaveSchema = z.object({
//   uid: z.string(),
//   state: z.unknown(),
// });

export const saveGame = async (uid: string, state: GameState): Promise<void> => {
  const app = getAdminApp();
  const db = getFirestore(app);
  await db.collection("games").doc(uid).set({ uid, updatedAt: Date.now(), state }, { merge: true });
};

export const loadGame = async (uid: string): Promise<GameState | null> => {
  const app = getAdminApp();
  const db = getFirestore(app);
  const snap = await db.collection("games").doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data() as { state?: GameState } | undefined;
  return data?.state ?? null;
};

export const clearSavedGame = async (uid: string): Promise<void> => {
  const app = getAdminApp();
  const db = getFirestore(app);
  await db.collection("games").doc(uid).delete();
};
