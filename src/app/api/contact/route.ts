import { createHmac, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { insertContact } from "@/lib/database";

export async function POST(req: Request) {
  if (req.headers.get("origin") !== new URL(req.url).origin) return NextResponse.json({ ok: false }, { status: 403 });
  try {
    if (Number(req.headers.get("content-length") || 0) > 24000) return NextResponse.json({ ok: false }, { status: 413 });
    const raw = await req.text();
    if (raw.length > 24000) return NextResponse.json({ ok: false }, { status: 413 });
    const body = JSON.parse(raw);
    if (!body || ["name", "email", "message"].some((key) => typeof body[key] !== "string") || (body.phone !== undefined && typeof body.phone !== "string")) return NextResponse.json({ ok: false }, { status: 400 });
    const name = body.name.trim(), email = body.email.trim(), message = body.message.trim(), phone = (body.phone || "").trim();
    if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !message || message.length > 10000 || phone.length > 40) return NextResponse.json({ ok: false }, { status: 400 });
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const key = createHmac("sha256", process.env.AUTH_SECRET || "local-contact-limit").update(ip).digest("hex");
    const saved = await insertContact({ id: randomUUID(), name, email, phone, message, date: new Date().toISOString() }, key);
    return NextResponse.json({ ok: saved }, { status: saved ? 200 : 429 });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: error instanceof SyntaxError ? 400 : 503 });
  }
}
