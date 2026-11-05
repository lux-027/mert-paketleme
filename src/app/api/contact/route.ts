import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data", "messages.json");

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, message } = body ?? {};
  if (!name || !email || !message) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  let list: unknown[] = [];
  try {
    list = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    list = [];
  }
  list.push({ name, email, phone, message, date: new Date().toISOString() });
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
  return NextResponse.json({ ok: true });
}
