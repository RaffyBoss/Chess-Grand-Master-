import { NextResponse } from "next/server";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApp();
  const projectId = process.env.FIREBASE_PROJECT_ID as string | undefined;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL as string | undefined;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY as string | undefined)?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials in env");
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export async function POST(req: Request) {
  try {
    const { uid, state } = await req.json();
    const app = getAdminApp();
    const db = getFirestore(app);
    await db.collection("games").doc(uid).set({ uid, updatedAt: Date.now(), state }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
