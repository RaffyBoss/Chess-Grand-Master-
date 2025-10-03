"use client";

import React from "react";
import type { PieceColor, PieceType, PieceStyleId } from "./types";
import { cn } from "@/lib/utils";

export type RenderPieceProps = {
  type: PieceType;
  color: PieceColor;
  selected?: boolean;
  className?: string;
};

function pieceLetter(type: PieceType): string {
  switch (type) {
    case "p":
      return "P";
    case "n":
      return "N";
    case "b":
      return "B";
    case "r":
      return "R";
    case "q":
      return "Q";
    case "k":
      return "K";
  }
}

function MergedPiece({ type, color, selected, className }: RenderPieceProps) {
  const bg = color === "w" ? "fill-white" : "fill-black";
  const fg = color === "w" ? "text-black" : "text-white";
  return (
    <div
      className={cn(
        "relative grid place-items-center select-none",
        selected && "ring-2 ring-primary",
        className
      )}
      style={{ width: "100%", height: "100%" }}
    >
      <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] drop-shadow">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="42"
          className={bg}
          stroke={color === "w" ? "#111" : "#eee"}
          strokeWidth="4"
          filter="url(#glow)"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          className={cn("font-bold text-[46px]", fg)}
        >
          {pieceLetter(type)}
        </text>
      </svg>
    </div>
  );
}

function ClassicPiece({ type, color, selected, className }: RenderPieceProps) {
  const charMap: Record<PieceColor, Record<PieceType, string>> = {
    w: { p: "♙", n: "♘", b: "♗", r: "♖", q: "♕", k: "♔" },
    b: { p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" },
  };
  return (
    <div
      className={cn(
        "grid place-items-center text-4xl select-none",
        selected && "ring-2 ring-primary",
        className
      )}
      style={{ width: "100%", height: "100%" }}
    >
      <span>{charMap[color][type]}</span>
    </div>
  );
}

export function renderPiece(
  style: PieceStyleId,
  props: RenderPieceProps
): React.ReactNode {
  if (style === "Merged") return <MergedPiece {...props} />;
  return <ClassicPiece {...props} />;
}

export const DEFAULT_PIECE_STYLE: PieceStyleId = "Merged";
