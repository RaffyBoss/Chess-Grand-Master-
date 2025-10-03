"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const dark = theme === "dark";

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Appearance</h1>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <Switch checked={dark} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>
      </div>
    </div>
  );
}
