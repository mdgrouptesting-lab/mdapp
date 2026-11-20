import crypto from "crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { pricing } from "@/lib/config";
import { adminDb } from "@/lib/firebase-admin";
import { notifyCompany } from "@/lib/mail";
import { razorpay } from "@/lib/razorpay";
import { errorResponse, HttpError, requireUser } from "@/lib/server-auth";

export const runtime = "nodejs";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const decoded = await requireUser(req);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json().catch(() => ({}));
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) throw new HttpError(400, "Missing payment details");

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new HttpError(503, "Payment not configured");
    const expected = crypto.createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(String(razorpay_signature));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new HttpError(400, "Payment verification failed");

    // Confirm the order really belongs to this user and plan.
    const order = await razorpay().orders.fetch(razorpay_order_id);
    const notes = (order.notes || {}) as Record<string, string>;
    const plan = notes.plan as "client" | "worker";
    if (notes.uid !== decoded.uid || !(plan in pricing)) throw new HttpError(400, "Order does not match your account");
    if (Number(order.amount) !== pricing[plan].amount * 100) throw new HttpError(400, "Amount mismatch");

    const db = adminDb();
    const userRef = db.collection("users").doc(decoded.uid);
    const payRef = db.collection("payments").doc(razorpay_payment_id);

    const result = await db.runTransaction(async (tx) => {
      const [paySnap, userSnap] = await Promise.all([tx.get(payRef), tx.get(userRef)]);
      if (paySnap.exists) return { already: true, user: userSnap.data() };
      if (!userSnap.exists) throw new HttpError(404, "Profile not found");
      const user = userSnap.data()!;

      let expiresAt: Timestamp | null = null;
      if (plan === "worker") {
        const current = user.subscription?.expiresAt as Timestamp | null | undefined;
        const base = current && current.toMillis() > Date.now() ? current.toMillis() : Date.now();
        expiresAt = Timestamp.fromMillis(base + YEAR_MS);
      }
      tx.update(userRef, {
        subscription: { status: "active", plan, paidAt: FieldValue.serverTimestamp(), expiresAt },
        updatedAt: FieldValue.serverTimestamp(),
      });
      tx.set(payRef, {
        uid: decoded.uid,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        plan,
        amount: pricing[plan].amount,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: "paid",
        createdAt: FieldValue.serverTimestamp(),
      });
      return { already: false, user };
    });

    if (!result.already) {
      await notifyCompany(`Membership payment received: ₹${pricing[plan].amount} (${plan})`, {
        Name: result.user?.name,
        Email: result.user?.email,
        Phone: result.user?.phone,
        Plan: pricing[plan].label,
        "Payment ID": razorpay_payment_id,
      });
    }
    return Response.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
