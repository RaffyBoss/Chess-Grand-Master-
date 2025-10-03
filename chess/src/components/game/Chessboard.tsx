"use client";

import React, { useMemo } from "react";
import type { BoardThemeId, PieceStyleId } from "@/lib/types";
import { getBoardTheme } from "@/lib/board-styles";
import { renderPiece } from "@/lib/piece-styles";
import { cn } from "@/lib/utils";

export type SquarePiece = {
  type: "p" | "n" | "b" | "r" | "q" | "k";
  color: "w" | "b";
};

export type BoardPosition = (SquarePiece | null)[][]; // [rank][file]

export type ChessboardProps = {
  position: BoardPosition;
  orientation: "white" | "black";
  selectableSquares?: string[];
  lastMoveSquares?: string[];
  draggingSquare?: string | null;
  onSquareClick?: (square: string) => void;
  onDrop?: (from: string, to: string, promotion?: "q" | "r" | "b" | "n") => void;
  theme: BoardThemeId;
  pieceStyle: PieceStyleId;
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

function squareName(fileIndex: number, rankIndex: number, orientation: "white" | "black"): string {
  const file = orientation === "white" ? files[fileIndex] : files[7 - fileIndex];
  const rank = orientation === "white" ? 8 - rankIndex : rankIndex + 1;
  return `${file}${rank}`;
}

export function Chessboard(props: ChessboardProps) {
  const { theme: themeId, pieceStyle, position, orientation, onSquareClick, selectableSquares = [], lastMoveSquares = [] } = props;
  const theme = getBoardTheme(themeId);

  const ranks = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);
  const filesIdx = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  return (
    <div className={cn("aspect-square max-w-[min(90vw,90vh)] w-full mx-auto", "rounded-xl border-4", theme.borderClass)}>
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full"
        onDragOver={(e) => {
          // allow dropping on the board
          e.preventDefault();
        }}
      >
        {ranks.map((r) =>
          filesIdx.map((f) => {
            const sq = squareName(f, r, orientation);
            const isLight = (r + f) % 2 === 0;
            const bgClass = isLight ? theme.lightSquareClass : theme.darkSquareClass;
            const selected = selectableSquares.includes(sq);
            const highlight = lastMoveSquares.includes(sq);
            const piece = orientation === "white" ? position[r][f] : position[7 - r][7 - f];
            return (
              <div
                key={`${r}-${f}`}
                data-square={sq}
                onClick={() => onSquareClick?.(sq)}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = e.dataTransfer.getData("application/x-chess-from");
                  const promo = e.dataTransfer.getData("application/x-chess-promo") as
                    | "q"
                    | "r"
                    | "b"
                    | "n"
                    | undefined;
                  if (from && from !== sq) {
                    props.onDrop?.(from, sq, promo);
                  }
                }}
                className={cn(
                  "relative select-none",
                  bgClass,
                  selected && "ring-2 ring-emerald-400",
                  highlight && "after:absolute after:inset-0 after:bg-yellow-300/20"
                )}
              >
                {piece && (
                  <div
                    className="w-full h-full p-1"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/x-chess-from", sq);
                      // best-effort promotion guess: handled by caller
                    }}
                  >
                    {renderPiece(pieceStyle, { type: piece.type, color: piece.color })}
                  </div>
                )}
                <div className={cn("absolute bottom-1 right-1 text-[10px] text-white/60")}>{sq}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
