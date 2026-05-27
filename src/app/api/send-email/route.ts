import { Resend } from "resend";
import { verifyIdToken, adminConfigured } from "@/lib/firebase/admin";
import { isAdminEmail } from "@/lib/config";

interface Attachment {
  url: string;
  filename: string;
}

interface Payload {
  to: string;
  subject: string;
  body: string;
  attachments?: Attachment[];
}

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return Response.json({ sent: false, reason: "bad_request" }, { status: 400 });
  }

  if (!data.to || !data.subject || !data.body) {
    return Response.json({ sent: false, reason: "missing_fields" }, { status: 400 });
  }

  // --- authorize: caller must be a verified admin ---------------------------
  if (!adminConfigured()) {
    // Can't verify identity server-side → refuse to actually send.
    // The admin UI falls back to copy / "open in Gmail".
    return Response.json({ sent: false, reason: "auth_not_configured" });
  }
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const decoded = await verifyIdToken(token);
  if (!decoded) {
    return Response.json({ sent: false, reason: "unauthorized" }, { status: 401 });
  }
  const isAdmin = decoded.admin === true || isAdminEmail(decoded.email);
  if (!isAdmin) {
    return Response.json({ sent: false, reason: "forbidden" }, { status: 403 });
  }

  // --- send -----------------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ sent: false, reason: "resend_not_configured" });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Manfath <onboarding@resend.dev>",
      to: data.to,
      subject: data.subject,
      text: data.body,
      attachments: (data.attachments ?? []).map((a) => ({
        filename: a.filename,
        path: a.url,
      })),
    });
    if (result.error) {
      return Response.json({ sent: false, reason: result.error.message }, { status: 502 });
    }
    return Response.json({ sent: true, id: result.data?.id });
  } catch (err) {
    return Response.json(
      { sent: false, reason: err instanceof Error ? err.message : "send_failed" },
      { status: 502 },
    );
  }
}
