import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { notifyCompany } from "@/lib/mail";
import { errorResponse, getProfile, HttpError, requireUser } from "@/lib/server-auth";
import { isSubscriptionActive } from "@/lib/utils";

export const runtime = "nodejs";

const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

/** Client submits a problem (with photos already uploaded to Storage). */
export async function POST(req: Request) {
  try {
    const decoded = await requireUser(req);
    const profile = await getProfile(decoded.uid);
    if (!profile) throw new HttpError(403, "Profile not found");
    if (profile.role !== "client" && profile.role !== "admin") throw new HttpError(403, "Only clients can report problems");
    if (profile.role === "client" && !isSubscriptionActive(profile.subscription))
      throw new HttpError(402, "Please activate your ₹50 lifetime membership first");

    const body = await req.json().catch(() => ({}));
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
    const images: string[] = (Array.isArray(body.images) ? body.images : [])
      .filter((u: unknown) => typeof u === "string" && u.startsWith("https://firebasestorage.googleapis.com/") && (!bucket || u.includes(bucket)))
      .slice(0, 6);

    const data = {
      clientId: decoded.uid,
      clientName: profile.name,
      clientPhone: clip(body.phone, 20) || profile.phone,
      clientEmail: profile.email,
      address: clip(body.address, 300) || profile.address || "",
      problem: clip(body.problem, 80),
      description: clip(body.description, 2000),
      preferredTime: clip(body.preferredTime, 60),
      images,
      status: "new",
      assignedWorkerId: null,
      assignedWorkerName: null,
      workerImages: [],
      workerNote: "",
      adminNote: "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (!data.problem) throw new HttpError(400, "Please choose the problem type");
    if (!data.address) throw new HttpError(400, "Please enter the site address");

    const ref = await adminDb().collection("serviceRequests").add(data);

    await notifyCompany(
      `New problem reported: ${data.problem} — ${data.clientName}`,
      {
        Client: data.clientName,
        Phone: data.clientPhone,
        Email: data.clientEmail,
        Address: data.address,
        Problem: data.problem,
        Details: data.description || "—",
        "Preferred call time": data.preferredTime || "—",
        "Request ID": ref.id,
      },
      images,
    );
    return Response.json({ ok: true, id: ref.id });
  } catch (e) {
    return errorResponse(e);
  }
}
