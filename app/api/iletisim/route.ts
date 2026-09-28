// İletişim formu uç noktası.
// RESEND_API_KEY + CONTACT_TO_EMAIL tanımlıysa e-posta gönderir; değilse 503 döner
// (arayüz ziyaretçiyi Instagram'a yönlendirir, sahte "gönderildi" gösterilmez).

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

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const rows = [
    ["Ad Soyad", name],
    ["Telefon", phone || "—"],
    ["E-posta", email || "—"],
    ["Konu", topic || "—"],
  ];
  const html = `
    <h2 style="font-family:Georgia,serif">Web sitesinden yeni mesaj</h2>
    <table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>
    <p style="white-space:pre-wrap">${esc(message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "ARAS İNŞAAT Web <onboarding@resend.dev>",
      to: [to],
      reply_to: email || undefined,
      subject: `Web formu: ${topic || "Genel"} — ${name}`,
      html,
    }),
  });

  if (!res.ok) return Response.json({ error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
