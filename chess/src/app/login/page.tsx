"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInAnonymously, onAuthStateChanged } from "@/lib/firebase";
import { getClientFirebase } from "@/lib/firebase";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const { auth } = getClientFirebase();
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) router.replace("/menu");
      });
      return () => unsub();
    } catch {
      // Firebase not configured: allow guest button only
    }
  }, [router]);

  async function signInGoogle() {
    setLoading(true);
    try {
      const { auth } = getClientFirebase();
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.replace("/menu");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Google sign-in failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function signInFacebook() {
    setLoading(true);
    try {
      const { auth } = getClientFirebase();
      await signInWithPopup(auth, new FacebookAuthProvider());
      router.replace("/menu");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Facebook sign-in failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function signInGuest() {
    setLoading(true);
    try {
      const { auth } = getClientFirebase();
      await signInAnonymously(auth);
      router.replace("/menu");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Guest sign-in failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-gradient-to-br from-black via-slate-900 to-slate-800">
      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Welcome to GenChess</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" size="lg" onClick={signInGoogle} disabled={loading}>
            Continue with Google
          </Button>
          <Button className="w-full" size="lg" variant="secondary" onClick={signInFacebook} disabled={loading}>
            Continue with Facebook
          </Button>
          <div className="pt-2" />
          <Button className="w-full" size="lg" variant="outline" onClick={signInGuest} disabled={loading}>
            Continue as Guest
          </Button>
          <p className="text-xs text-white/60 pt-2">Firebase env not set? Guest sign-in will still work locally.</p>
        </CardContent>
      </Card>
    </div>
  );
}
