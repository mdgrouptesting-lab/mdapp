import "server-only";
import nodemailer from "nodemailer";

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ENTITIES[c] || c);

/**
 * Sends a notification email to the company if SMTP is configured.
 * Never throws — the record is already saved in Firestore and visible in the Admin panel.
 */
export async function notifyCompany(subject: string, fields: Record<string, unknown>, images: string[] = []) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, COMPANY_NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !COMPANY_NOTIFY_EMAIL) return false;
  try {
    const port = Number(SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    const rows = Object.entries(fields)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 12px;background:#f4f6fb;font-weight:600;border:1px solid #e3e8f2">${esc(k)}</td><td style="padding:8px 12px;border:1px solid #e3e8f2">${esc(v)}</td></tr>`,
      )
      .join("");
    const imgs = images
      .map((u) => `<a href="${esc(u)}"><img src="${esc(u)}" style="width:160px;height:120px;object-fit:cover;border-radius:8px;margin:4px" /></a>`)
      .join("");
    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    await transporter.sendMail({
      from: `"MD Group Website" <${SMTP_USER}>`,
      to: COMPANY_NOTIFY_EMAIL,
      subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px">
        <h2 style="color:#0d1b38">${esc(subject)}</h2>
        <table style="border-collapse:collapse;width:100%">${rows}</table>
        ${imgs ? `<p style="margin-top:16px"><b>Photos:</b></p><div>${imgs}</div>` : ""}
        ${site ? `<p style="margin-top:20px"><a href="${esc(site)}/admin" style="background:#f98207;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Open Admin Panel</a></p>` : ""}
      </div>`,
    });
    return true;
  } catch (e) {
    console.error("Email failed:", e);
    return false;
  }
}
