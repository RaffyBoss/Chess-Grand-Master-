"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { Chessboard, type BoardPosition } from "@/components/game/Chessboard";
import { SideSelection } from "@/components/game/SideSelection";
import { PlayerInfo } from "@/components/game/PlayerInfo";
import { Button } from "@/components/ui/button";
import type { GameConfig, GameState } from "@/lib/types";
import { DEFAULT_BOARD_THEME_ID } from "@/lib/board-styles";
import { DEFAULT_PIECE_STYLE } from "@/lib/piece-styles";
import { toast } from "sonner";
import { getAiMove, saveGame, clearSavedGame } from "@/lib/actions";
import { onAuthStateChanged } from "@/lib/firebase";
import { getClientFirebase } from "@/lib/firebase";

function chessToBoardPosition(chess: Chess): BoardPosition {
  // chess.board() returns [rank][file] with objects or null
  const b = chess.board();
  return b.map((rank) =>
    rank.map((sq) => (
      sq
        ? { type: sq.type as 'p' | 'n' | 'b' | 'r' | 'q' | 'k', color: sq.color as 'w' | 'b' }
        : null
    ))
  );
}

export default function GamePage() {
  const [chess] = useState(() => new Chess());
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [position, setPosition] = useState<BoardPosition>(() => chessToBoardPosition(new Chess()));
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [whiteMs, setWhiteMs] = useState(5 * 60 * 1000);
  const [blackMs, setBlackMs] = useState(5 * 60 * 1000);
  const [selected, setSelected] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);
  const timersRef = useRef<{ interval?: ReturnType<typeof setInterval> | undefined }>({});
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    try {
      const { auth } = getClientFirebase();
      const unsub = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
      return () => unsub();
    } catch {
      // ignore if no firebase config
    }
  }, []);

  useEffect(() => {
    if (!config) return;
    setWhiteMs(config.timer.initialMs);
    setBlackMs(config.timer.initialMs);
    const side = config.side === "random" ? (Math.random() < 0.5 ? "white" : "black") : config.side;
    setOrientation(side);
    if (side === "black") {
      // If user chooses black, trigger AI first move
      requestAIMove(chess);
    }
    const autosave = setInterval(() => {
      if (!uid || !config) return;
      const state: GameState = {
        fen: chess.fen(),
        pgn: chess.pgn(),
        turn: chess.turn() as 'w' | 'b',
        isGameOver: chess.isGameOver(),
        timers: { whiteMs, blackMs },
        config,
      };
      saveGame(uid, state).catch(() => {});
    }, 15000);
    return () => clearInterval(autosave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, uid]);

  useEffect(() => {
    if (!config) return;
    if (timersRef.current.interval) clearInterval(timersRef.current.interval);
    const id = setInterval(() => {
      if (chess.isGameOver()) return;
      if (chess.turn() === "w") setWhiteMs((ms) => Math.max(0, ms - 1000));
      else setBlackMs((ms) => Math.max(0, ms - 1000));
    }, 1000);
    timersRef.current.interval = id;
    return () => clearInterval(id);
  }, [config, chess]);

  function onStart(cfg: GameConfig) {
    setConfig(cfg);
  }

  // const canMove = useMemo(() => (orientation === "white" ? turn === "w" : turn === "b"), [orientation, turn]);

  const requestAIMove = useCallback(async (chessPosition: Chess) => {
    if (!config) return;
    try {
      const { from, to, promotion } = await getAiMove(chessPosition.fen(), config.aiDifficulty);
      const mv = chess.move({ from, to, promotion });
      if (mv) {
        setPosition(chessToBoardPosition(chess));
        setTurn(chess.turn());
        setLastMoveSquares([mv.from, mv.to]);
        if (mv.color === "w") setWhiteMs((ms) => ms + config.timer.incrementMs);
        else setBlackMs((ms) => ms + config.timer.incrementMs);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI move failed";
      toast.error(msg);
    }
  }, [chess, config]);

  const onSquareClick = useCallback(
    (square: string) => {
      if (!config) return;
      // If no selection, try select own piece
      if (!selected) {
        const moves = chess.moves({ square: square as Square, verbose: true });
        if (moves.length && ((orientation === "white" && chess.get(square as Square)?.color === "w") || (orientation === "black" && chess.get(square as Square)?.color === "b"))) {
          setSelected(square);
          setLegalTargets(moves.map((m) => m.to));
        }
        return;
      }
      // If clicking same color piece, change selection
      const piece = chess.get(square as Square);
      if (piece && ((orientation === "white" && piece.color === "w") || (orientation === "black" && piece.color === "b"))) {
        const moves = chess.moves({ square: square as Square, verbose: true });
        setSelected(square);
        setLegalTargets(moves.map((m) => m.to));
        return;
      }
      // Attempt move from selected -> square
      const moves = chess.moves({ square: selected as Square, verbose: true });
      const toMove = moves.find((m) => m.to === square);
      if (toMove) {
        const mv = chess.move(toMove);
        if (mv) {
          setSelected(null);
          setLegalTargets([]);
          setPosition(chessToBoardPosition(chess));
          setTurn(chess.turn());
          setLastMoveSquares([mv.from, mv.to]);
          if (mv.color === "w") setWhiteMs((ms) => ms + (config?.timer.incrementMs ?? 0));
          else setBlackMs((ms) => ms + (config?.timer.incrementMs ?? 0));
          requestAIMove(chess);
        }
      } else {
        // Deselect if invalid
        setSelected(null);
        setLegalTargets([]);
      }
    },
    [selected, chess, config, orientation, requestAIMove]
  );

  const onDrop = useCallback(
    (from: string, to: string, promotion?: "q" | "r" | "b" | "n") => {
      if (!config) return;
      // naive auto-promotion to queen if needed
      const move = chess.move({ from, to, promotion: promotion ?? "q" });
      if (move) {
        setSelected(null);
        setLegalTargets([]);
        setPosition(chessToBoardPosition(chess));
        setTurn(chess.turn());
        setLastMoveSquares([move.from, move.to]);
        if (move.color === "w") setWhiteMs((ms) => ms + (config?.timer.incrementMs ?? 0));
        else setBlackMs((ms) => ms + (config?.timer.incrementMs ?? 0));
        requestAIMove(chess);
      }
    },
    [chess, config, requestAIMove]
  );

  function resign() {
    toast("You resigned. Game over.");
    if (uid) clearSavedGame(uid).catch(() => {});
  }

  // Load game state from localStorage if present (used by /game/load)
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("genc_h_saved_game") : null;
    if (raw) {
      try {
        const st: GameState = JSON.parse(raw);
        chess.load(st.fen);
        setPosition(chessToBoardPosition(chess));
        setTurn(chess.turn());
        setWhiteMs(st.timers.whiteMs);
        setBlackMs(st.timers.blackMs);
        setConfig(st.config);
      } catch {}
      localStorage.removeItem("genc_h_saved_game");
    }
  }, [chess]);

  return (
    <div className="min-h-dvh p-4 md:p-8 bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-900">
      {!config && <SideSelection onStart={onStart} />}
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-4">
          <Chessboard
            position={position}
            orientation={orientation}
            theme={config?.boardStyle ?? DEFAULT_BOARD_THEME_ID}
            pieceStyle={config?.pieceStyle ?? DEFAULT_PIECE_STYLE}
            selectableSquares={[...(selected ? [selected] : []), ...legalTargets]}
            lastMoveSquares={lastMoveSquares}
            onSquareClick={onSquareClick}
            onDrop={onDrop}
          />
          <div className="flex gap-2">
            <Button onClick={() => resign()} variant="destructive">Resign</Button>
            <Button onClick={() => chess.undo() && setPosition(chessToBoardPosition(chess))} variant="secondary">Undo</Button>
          </div>
        </div>
        <div className="space-y-3">
          <PlayerInfo name={orientation === "white" ? "You" : "AI"} rating={1200} timeMs={orientation === "white" ? whiteMs : blackMs} />
          <PlayerInfo name={orientation === "white" ? "AI" : "You"} rating={1400} timeMs={orientation === "white" ? blackMs : whiteMs} />
          <div className="text-white/80 text-sm leading-relaxed">
            Play against our scalable AI powered by Gemini. Get hints, customize themes, and enjoy smooth animations. Your game auto-saves every 15 seconds when logged in.
          </div>
        </div>
      </div>
    </div>
  );
}
