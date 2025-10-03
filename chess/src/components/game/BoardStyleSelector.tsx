"use client";

import { BOARD_THEMES } from "@/lib/board-styles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BoardThemeId } from "@/lib/types";

export function BoardStyleSelector({ value, onChange }: { value: BoardThemeId; onChange: (id: BoardThemeId) => void; }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as BoardThemeId)}>
      <SelectTrigger><SelectValue placeholder="Board Style" /></SelectTrigger>
      <SelectContent>
        {BOARD_THEMES.map(t => (
          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
