import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { notifyCompany } from "@/lib/mail";
import { errorResponse, HttpError } from "@/lib/server-auth";
import { isValidIndianPhone } from "@/lib/utils";

export const runtime = "nodejs";

const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // honeypot field for bots
    if (body.website) return Response.json({ ok: true });

    const data = {
      name: clip(body.name, 80),
      phone: clip(body.phone, 20),
      email: clip(body.email, 120),
      address: clip(body.address, 300),
      service: clip(body.service, 80) || "General",
      requirement: clip(body.requirement, 2000),
    };
    if (!data.name) throw new HttpError(400, "Please enter your name");
    if (!isValidIndianPhone(data.phone)) throw new HttpError(400, "Please enter a valid 10-digit mobile number");
    if (!data.address) throw new HttpError(400, "Please enter your address");
    if (!data.requirement) throw new HttpError(400, "Please describe your requirement");

    const ref = await adminDb()
      .collection("enquiries")
      .add({ ...data, status: "new", createdAt: FieldValue.serverTimestamp() });

    await notifyCompany(`New enquiry: ${data.service} — ${data.name}`, {
      Name: data.name,
      Phone: data.phone,
      Email: data.email || "—",
      Address: data.address,
      Service: data.service,
      Requirement: data.requirement,
    });

    return Response.json({ ok: true, id: ref.id });
  } catch (e) {
    return errorResponse(e);
  }
}
