import { NextResponse } from "next/server";
import { auth, ALLOWED_EMAILS } from "@/auth";
import { signUpload, verifyUpload } from "@/lib/cloudinary";
import { UserError } from "@/lib/types";

export const runtime = "nodejs";

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !ALLOWED_EMAILS.includes(email)) return json({ error: "Yönetici girişi gerekli." }, 403);
  if (request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Geçersiz istek kaynağı." }, 403);
  try {
    if (Number(request.headers.get("content-length") || 0) > 4096) return json({ error: "İstek çok büyük." }, 413);
    const text = await request.text();
    if (text.length > 4096) return json({ error: "İstek çok büyük." }, 413);
    const body = JSON.parse(text);
    if (body.kind !== "image" && body.kind !== "video") return json({ error: "Geçersiz dosya türü." }, 400);
    if (body.operation === "sign") return json(signUpload(body.kind));
    if (body.operation === "verify" && typeof body.publicId === "string") return json(await verifyUpload(body.publicId, body.kind, email));
    return json({ error: "Geçersiz yükleme işlemi." }, 400);
  } catch (error) {
    return json({ error: error instanceof UserError ? error.message : "Yükleme hizmetine ulaşılamadı. Lütfen tekrar deneyin." }, error instanceof UserError || error instanceof SyntaxError ? 400 : 503);
  }
}
