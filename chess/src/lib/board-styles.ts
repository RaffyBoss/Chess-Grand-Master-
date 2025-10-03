import type { BoardThemeId } from "./types";

export type BoardTheme = {
  id: BoardThemeId;
  name: string;
  lightSquareClass: string;
  darkSquareClass: string;
  borderClass: string;
};

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: "Wood",
    name: "Wood",
    lightSquareClass: "bg-amber-200",
    darkSquareClass: "bg-amber-600",
    borderClass: "border-amber-800",
  },
  {
    id: "Marble",
    name: "Marble",
    lightSquareClass: "bg-neutral-200",
    darkSquareClass: "bg-neutral-500",
    borderClass: "border-neutral-700",
  },
  {
    id: "Midnight",
    name: "Midnight",
    lightSquareClass: "bg-indigo-600/30",
    darkSquareClass: "bg-indigo-800",
    borderClass: "border-indigo-900",
  },
  {
    id: "Emerald",
    name: "Emerald",
    lightSquareClass: "bg-emerald-200",
    darkSquareClass: "bg-emerald-700",
    borderClass: "border-emerald-900",
  },
  {
    id: "Slate",
    name: "Slate",
    lightSquareClass: "bg-slate-300",
    darkSquareClass: "bg-slate-700",
    borderClass: "border-slate-800",
  },
  {
    id: "Sand",
    name: "Sand",
    lightSquareClass: "bg-yellow-100",
    darkSquareClass: "bg-yellow-400",
    borderClass: "border-yellow-700",
  },
];

export const DEFAULT_BOARD_THEME_ID: BoardThemeId = "Wood";

export function getBoardTheme(themeId: BoardThemeId): BoardTheme {
  return BOARD_THEMES.find((t) => t.id === themeId) || BOARD_THEMES[0];
}
