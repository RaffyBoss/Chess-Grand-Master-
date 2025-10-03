"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FriendsPage() {
  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(window.location.origin + "/game?invite=" + Math.random().toString(36).slice(2));
  }, []);

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-xl space-y-3">
        <h1 className="text-2xl font-semibold">Invite a Friend</h1>
        <div className="flex gap-2">
          <Input value={link} readOnly />
          <Button onClick={() => navigator.clipboard.writeText(link)}>Copy</Button>
        </div>
        <p className="text-sm text-muted-foreground">Share this link. Your friend can join and you can customize appearance in settings.</p>
      </div>
    </div>
  );
}
