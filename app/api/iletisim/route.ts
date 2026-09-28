// İletişim formu uç noktası.
// Gönderim sırası:
//   1) SMTP (varsayılan Gmail) — SMTP_USER + SMTP_PASS tanımlıysa. Önerilen yöntem.
//   2) Resend — RESEND_API_KEY tanımlıysa.
//   3) Hiçbiri yoksa 503 → istemci FormSubmit ile tarayıcıdan gönderir (bkz. components/Contact.tsx).
// Sahte "gönderildi" yanıtı verilmez.

import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Bot tuzağı doluysa sessizce kabul et.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  const topic = clean(body.topic, 80);
  const message = clean(body.message, 4000);

  if (!name || !message || (!phone && !email) || !body.kvkk) {
    return Response.json({ error: "validation" }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "email" }, { status: 422 });
  }

  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const subject = `Web sitesi: ${topic || "Bilgi talebi"} — ${name}`;
  const rows: [string, string][] = [
    ["Ad Soyad", name],
    ["Telefon", phone || "—"],
    ["E-posta", email || "—"],
    ["Konu", topic || "—"],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;color:#1f2024">
      <h2 style="font-family:Georgia,serif;font-weight:400;color:#8a6a42;border-bottom:1px solid #d3a971;padding-bottom:12px">
        Web sitesinden yeni mesaj
      </h2>
      <table cellpadding="8" style="border-collapse:collapse;width:100%">
        ${rows.map(([k, v]) => `<tr><td style="width:120px;color:#6b6b6b">${k}</td><td><b>${esc(v)}</b></td></tr>`).join("")}
      </table>
      <p style="white-space:pre-wrap;background:#f6f3ed;padding:16px;line-height:1.6">${esc(message)}</p>
      <p style="font-size:12px;color:#9a978f">Bu e-posta ${site.name} web sitesindeki iletişim formundan gönderildi. Yanıtla dediğinizde ${email ? "doğrudan ziyaretçiye" : "size"} gider.</p>
    </div>`;
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", message].join("\n");

  try {
    // 1) SMTP (Gmail uygulama şifresi vb.)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const port = Number(process.env.SMTP_PORT || 465);
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transport.sendMail({
        from: `"${site.name} Web Sitesi" <${process.env.SMTP_USER}>`,
        to,
        replyTo: email || undefined,
        subject,
        text,
        html,
      });
      return Response.json({ ok: true, via: "smtp" });
    }

    // 2) Resend
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || `${site.name} Web <onboarding@resend.dev>`,
          to: [to],
          reply_to: email || undefined,
          subject,
          text,
          html,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
      return Response.json({ ok: true, via: "resend" });
    }
  } catch (err) {
    console.error("[iletisim] gönderim hatası:", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  // 3) Sunucuda gönderim yöntemi yok → istemci yedeğe geçer.
  return Response.json({ error: "not_configured" }, { status: 503 });
}
