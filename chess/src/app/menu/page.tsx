"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { onAuthStateChanged, type User } from "@/lib/firebase";
import { getClientFirebase } from "@/lib/firebase";
import Link from "next/link";

export default function MenuPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const { auth } = getClientFirebase();
      const unsub = onAuthStateChanged(auth, (u) => {
        if (!u) router.replace("/login");
        setUser(u);
      });
      return () => unsub();
    } catch {
      // No firebase config; allow access
    }
  }, [router]);

  return (
    <div className="min-h-dvh p-6 md:p-10 bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-900">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur">
          <CardContent className="p-6 flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user?.photoURL ?? undefined} />
              <AvatarFallback>{user?.displayName?.[0] ?? "G"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white text-lg font-semibold">{user?.displayName ?? "Guest"}</p>
              <p className="text-white/70 text-sm">Rating: 1200</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/game">
            <Button className="w-full h-16 text-lg">Play CPU</Button>
          </Link>
          <Link href="/friends">
            <Button variant="secondary" className="w-full h-16 text-lg">Play with Friends</Button>
          </Link>
          <Link href="/game/load">
            <Button variant="outline" className="w-full h-16 text-lg">Load Game</Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full h-16 text-lg">Settings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
