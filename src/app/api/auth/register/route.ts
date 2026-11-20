import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { adminEmails, errorResponse, HttpError, requireUser } from "@/lib/server-auth";
import { isValidIndianPhone } from "@/lib/utils";

export const runtime = "nodejs";

const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

/**
 * Creates the Firestore profile for a newly registered user.
 * Role / subscription / verification are set ONLY here on the server, never by the browser.
 */
export async function POST(req: Request) {
  try {
    const decoded = await requireUser(req);
    const body = await req.json().catch(() => ({}));
    const ref = adminDb().collection("users").doc(decoded.uid);
    const existing = await ref.get();
    if (existing.exists) return Response.json({ ok: true, role: existing.data()?.role });

    const email = (decoded.email || "").toLowerCase();
    const requested = body.role === "worker" ? "worker" : "client";
    const isOwner = adminEmails().includes(email);
    const role = isOwner ? "admin" : requested;

    const name = clip(body.name, 80);
    const phone = clip(body.phone, 20);
    if (!name) throw new HttpError(400, "Name is required");
    if (!isValidIndianPhone(phone)) throw new HttpError(400, "Enter a valid 10-digit mobile number");

    const profile: Record<string, unknown> = {
      uid: decoded.uid,
      role,
      name,
      email,
      phone,
      address: clip(body.address, 300),
      city: clip(body.city, 80),
      subscription: { status: isOwner ? "active" : "inactive", plan: null, paidAt: null, expiresAt: null },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (requested === "worker") {
      profile.workType = clip(body.workType, 60);
      profile.experience = clip(body.experience, 40);
      profile.about = clip(body.about, 600);
      profile.verification = { status: "not_submitted", idProofUrl: "", workPhotos: [], note: "" };
    }
    await ref.set(profile);
    return Response.json({ ok: true, role });
  } catch (e) {
    return errorResponse(e);
  }
}
