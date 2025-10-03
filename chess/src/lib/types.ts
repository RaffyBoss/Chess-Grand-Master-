export type PieceColor = "w" | "b";
export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

export type PieceStyleId = "Merged" | "Classic";

export type BoardThemeId =
  | "Wood"
  | "Marble"
  | "Midnight"
  | "Emerald"
  | "Slate"
  | "Sand";

export type AiDifficulty = 1 | 2 | 3 | 4 | 5;

export type TimerSettings = {
  initialMs: number; // starting time in ms
  incrementMs: number; // increment per move in ms
};

export type GameSide = "white" | "black" | "random";

export type GameConfig = {
  side: GameSide;
  aiDifficulty: AiDifficulty;
  timer: TimerSettings;
  pieceStyle: PieceStyleId;
  boardStyle: BoardThemeId;
};

export type MoveCoords = {
  from: string; // e.g., "e2"
  to: string;   // e.g., "e4"
  promotion?: "q" | "r" | "b" | "n";
  san?: string; // Standard Algebraic Notation
};

export type GameTimers = {
  whiteMs: number;
  blackMs: number;
};

export type GameState = {
  fen: string;
  pgn: string;
  turn: PieceColor; // "w" or "b"
  isGameOver: boolean;
  result?: "1-0" | "0-1" | "1/2-1/2";
  reason?: string;
  timers: GameTimers;
  config: GameConfig;
};

export type SavedGameDoc = {
  uid: string;
  updatedAt: number; // epoch ms
  state: GameState;
};

export type HintResponse = {
  move: MoveCoords;
  explanation: string;
};

export type UserProfile = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  rating: number;
};
