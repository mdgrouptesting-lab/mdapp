import { pricing } from "@/lib/config";
import { razorpay } from "@/lib/razorpay";
import { errorResponse, getProfile, HttpError, requireUser } from "@/lib/server-auth";
import { daysLeft, isSubscriptionActive } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const decoded = await requireUser(req);
    const profile = await getProfile(decoded.uid);
    if (!profile) throw new HttpError(403, "Profile not found");
    if (profile.role !== "client" && profile.role !== "worker") throw new HttpError(400, "Admins do not need a membership");

    const plan = profile.role; // price is decided by the server, never by the browser
    if (plan === "client" && isSubscriptionActive(profile.subscription))
      throw new HttpError(400, "Your lifetime membership is already active");
    if (plan === "worker" && isSubscriptionActive(profile.subscription) && (daysLeft(profile.subscription) ?? 0) > 30)
      throw new HttpError(400, "You can renew within 30 days of expiry");

    const amount = pricing[plan].amount * 100; // paise
    const order = await razorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `${plan}_${decoded.uid.slice(0, 12)}_${Date.now().toString(36)}`.slice(0, 40),
      notes: { uid: decoded.uid, plan },
    });

    return Response.json({
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      plan,
      description: pricing[plan].label,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
