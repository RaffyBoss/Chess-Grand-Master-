"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientFirebase, onAuthStateChanged } from "@/lib/firebase";
import { loadGame } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";

export default function GameLoadPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Fetching your saved game...");

  useEffect(() => {
    try {
      const { auth } = getClientFirebase();
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setMessage("Please log in to load saved games.");
          setTimeout(() => router.replace("/login"), 1200);
          return;
        }
        const state = await loadGame(user.uid);
        if (state) {
          try {
            localStorage.setItem("genc_h_saved_game", JSON.stringify(state));
          } catch {}
          router.replace("/game");
        }
        else {
          setMessage("No saved game found.");
          setTimeout(() => router.replace("/menu"), 1200);
        }
      });
      return () => unsub();
    } catch {
      setMessage("Loading is available when Firebase is configured.");
      setTimeout(() => router.replace("/menu"), 1200);
    }
  }, [router]);

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <Card>
        <CardContent className="p-6">{message}</CardContent>
      </Card>
    </div>
  );
}
