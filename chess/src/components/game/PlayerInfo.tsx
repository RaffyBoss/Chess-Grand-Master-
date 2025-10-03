"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PlayerInfo({ name, rating, avatarUrl, timeMs }: { name: string; rating: number; avatarUrl?: string | null; timeMs: number; }) {
  function format(ms: number) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(total / 60).toString().padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur rounded-xl px-3 py-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="text-white">
        <div className="text-sm font-semibold leading-tight">{name}</div>
        <div className="text-xs text-white/70 leading-tight">{rating} • {format(timeMs)}</div>
      </div>
    </div>
  );
}
