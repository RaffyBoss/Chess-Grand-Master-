"use client";

import type { PieceStyleId } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PieceStyleSelector({ value, onChange }: { value: PieceStyleId; onChange: (id: PieceStyleId) => void; }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as PieceStyleId)}>
      <SelectTrigger><SelectValue placeholder="Piece Style" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="Merged">Merged</SelectItem>
        <SelectItem value="Classic">Classic</SelectItem>
      </SelectContent>
    </Select>
  );
}
