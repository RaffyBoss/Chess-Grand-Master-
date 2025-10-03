"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AiDifficulty, BoardThemeId, GameConfig, GameSide, PieceStyleId, TimerSettings } from "@/lib/types";

export function SideSelection({ onStart }: { onStart: (config: GameConfig) => void }) {
  const [open, setOpen] = useState(true);
  const [side, setSide] = useState<GameSide>("white");
  const [difficulty, setDifficulty] = useState<AiDifficulty>(2);
  const [initialMs, setInitialMs] = useState(5 * 60 * 1000);
  const [incMs, setIncMs] = useState(2 * 1000);
  const [pieceStyle, setPieceStyle] = useState<PieceStyleId>("Merged");
  const [boardStyle, setBoardStyle] = useState<BoardThemeId>("Wood");

  function start() {
    const timer: TimerSettings = { initialMs, incrementMs: incMs };
    const config: GameConfig = { side, aiDifficulty: difficulty, timer, pieceStyle, boardStyle };
    setOpen(false);
    onStart(config);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span />
      </DialogTrigger>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Game Setup</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Side</Label>
            <Select value={side} onValueChange={(v) => setSide(v as GameSide)}>
              <SelectTrigger><SelectValue placeholder="Choose side" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="random">Random</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={String(difficulty)} onValueChange={(v) => setDifficulty(Number(v) as AiDifficulty)}>
              <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5].map(n => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Timer (minutes)</Label>
            <Select value={String(initialMs)} onValueChange={(v) => setInitialMs(Number(v))}>
              <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>
                {[
                  1*60*1000,
                  3*60*1000,
                  5*60*1000,
                  10*60*1000,
                  15*60*1000,
                ].map(v => (
                  <SelectItem key={v} value={String(v)}>{Math.round(v/60000)} min</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Increment</Label>
            <Select value={String(incMs)} onValueChange={(v) => setIncMs(Number(v))}>
              <SelectTrigger><SelectValue placeholder="Select increment" /></SelectTrigger>
              <SelectContent>
                {[0,1,2,3,5,10].map(v => (
                  <SelectItem key={v} value={String(v*1000)}>{v}s</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Pieces</Label>
            <Select value={pieceStyle} onValueChange={(v) => setPieceStyle(v as PieceStyleId)}>
              <SelectTrigger><SelectValue placeholder="Select piece style" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Merged">Merged</SelectItem>
                <SelectItem value="Classic">Classic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Board</Label>
            <Select value={boardStyle} onValueChange={(v) => setBoardStyle(v as BoardThemeId)}>
              <SelectTrigger><SelectValue placeholder="Select board style" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Wood">Wood</SelectItem>
                <SelectItem value="Marble">Marble</SelectItem>
                <SelectItem value="Midnight">Midnight</SelectItem>
                <SelectItem value="Emerald">Emerald</SelectItem>
                <SelectItem value="Slate">Slate</SelectItem>
                <SelectItem value="Sand">Sand</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <Button onClick={start}>Start Game</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
