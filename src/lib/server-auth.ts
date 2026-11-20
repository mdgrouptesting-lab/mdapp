import "server-only";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth, adminDb } from "./firebase-admin";
import type { UserProfile } from "./types";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireUser(req: Request): Promise<DecodedIdToken> {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Not logged in");
  try {
    return await adminAuth().verifyIdToken(token);
  } catch {
    throw new HttpError(401, "Session expired, please log in again");
  }
}

export async function getProfile(uid: string) {
  const snap = await adminDb().collection("users").doc(uid).get();
  return snap.exists ? (snap.data() as UserProfile) : null;
}

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function errorResponse(e: unknown) {
  const status = e instanceof HttpError ? e.status : 500;
  const message = e instanceof Error ? e.message : "Something went wrong";
  if (status === 500) console.error(e);
  return Response.json({ error: message }, { status });
}
