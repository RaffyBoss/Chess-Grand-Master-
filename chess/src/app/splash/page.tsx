"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/login"), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-800">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto w-28 h-28 rounded-2xl grid place-items-center bg-white/10 backdrop-blur border border-white/20 shadow-2xl"
        >
          <span className="text-5xl">♟️</span>
        </motion.div>
        <motion.h1
          className="mt-6 text-3xl font-bold text-white tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          GenChess
        </motion.h1>
        <motion.p
          className="mt-2 text-white/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Loading greatness...
        </motion.p>
      </motion.div>
    </div>
  );
}
