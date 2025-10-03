import type { GameState, MoveCoords } from "@/lib/types";

export async function apiGetAiMove(fen: string, difficulty: number): Promise<MoveCoords> {
  const res = await fetch("/api/ai/move", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fen, difficulty }) });
  if (!res.ok) throw new Error("AI move failed");
  return res.json();
}

export async function apiGetHint(fen: string): Promise<{ move: MoveCoords; explanation: string }> {
  const res = await fetch("/api/ai/hint", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fen }) });
  if (!res.ok) throw new Error("Hint failed");
  return res.json();
}

export async function apiSaveGame(uid: string, state: GameState): Promise<void> {
  await fetch("/api/game/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uid, state }) });
}

export async function apiLoadGame(uid: string): Promise<GameState | null> {
  const res = await fetch("/api/game/load", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uid }) });
  if (!res.ok) return null;
  const data = await res.json();
  return (data?.state as GameState | null) ?? null;
}

export async function apiClearSavedGame(uid: string): Promise<void> {
  await fetch("/api/game/clear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uid }) });
}
