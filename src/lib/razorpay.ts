import "server-only";
import Razorpay from "razorpay";
import { HttpError } from "./server-auth";

let _rzp: Razorpay | undefined;

export function razorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new HttpError(503, "Online payment is not configured yet. Please contact MD Group.");
  if (!_rzp) _rzp = new Razorpay({ key_id, key_secret });
  return _rzp;
}
