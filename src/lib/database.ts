import "server-only";
import { neon } from "@neondatabase/serverless";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import seed from "../../data/store.json";
import type { Store } from "./types";
import { UserError } from "./types";

export type ContactMessage = { id?: string; name: string; email: string; phone?: string; message: string; date: string };
export const initialStore = seed as Store;

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

export function database() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  return url ? neon(url) : null;
}

export function legacyMessages(): ContactMessage[] {
  const file = path.join(process.cwd(), "data", "messages.json");
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(data)) throw new UserError("Mesaj dosyası okunamadı.");
  return data;
}

export function isMissingTable(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "42P01";
}

export async function databaseStatus() {
  const sql = database();
  if (!sql) return "missing" as const;
  try {
    const rows = await sql`SELECT id FROM mert_site_state WHERE id = 'catalog'`;
    return rows.length ? "ready" as const : "setup" as const;
  } catch (error) {
    return isMissingTable(error) ? "setup" as const : "error" as const;
  }
}

export async function initializeDatabase() {
  const sql = database();
  if (!sql) throw new UserError("Vercel ortam değişkenlerine DATABASE_URL eklenmelidir.");
  const messages = legacyMessages().map((message, index) => ({
    id: createHash("sha256").update(JSON.stringify([index, message])).digest("hex"),
    payload: message,
    created_at: Number.isNaN(Date.parse(message.date)) ? new Date().toISOString() : message.date,
  }));
  await sql.transaction([
    sql`CREATE TABLE IF NOT EXISTS mert_site_state (id text PRIMARY KEY, payload jsonb NOT NULL, revision integer NOT NULL DEFAULT 0)`,
    sql`CREATE TABLE IF NOT EXISTS mert_contact_messages (id text PRIMARY KEY, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
    sql`CREATE TABLE IF NOT EXISTS mert_contact_limits (key text PRIMARY KEY, hits integer NOT NULL, reset_at timestamptz NOT NULL)`,
    sql`INSERT INTO mert_site_state (id, payload) VALUES ('catalog', ${JSON.stringify(initialStore)}::jsonb) ON CONFLICT (id) DO NOTHING`,
    sql`INSERT INTO mert_contact_messages (id, payload, created_at) SELECT id, payload, created_at FROM jsonb_to_recordset(${JSON.stringify(messages)}::jsonb) AS entries(id text, payload jsonb, created_at timestamptz) ON CONFLICT (id) DO NOTHING`,
  ]);
}

export async function readDatabaseStore(): Promise<{ payload: Store; revision: number } | null> {
  const sql = database();
  if (!sql) return null;
  try {
    const rows = await sql`SELECT payload, revision FROM mert_site_state WHERE id = 'catalog'`;
    return rows[0] as { payload: Store; revision: number } | undefined ?? null;
  } catch (error) {
    if (isMissingTable(error)) return null;
    throw error;
  }
}

export async function updateDatabaseStore<T>(update: (store: Store) => T): Promise<T> {
  const sql = database();
  if (!sql) throw new UserError("DATABASE_URL bağlantısı eksik.");
  for (let attempt = 0; attempt < 5; attempt++) {
    const row = await readDatabaseStore();
    if (!row) throw new UserError("Önce ana paneldeki veritabanı kurulumunu tamamlayın.");
    const result = update(row.payload);
    const rows = await sql`UPDATE mert_site_state SET payload = ${JSON.stringify(row.payload)}::jsonb, revision = revision + 1 WHERE id = 'catalog' AND revision = ${row.revision} RETURNING revision`;
    if (rows.length) return result;
  }
  throw new UserError("Başka bir yönetici aynı anda değişiklik yaptı. Lütfen tekrar deneyin.");
}

export async function readInbox() {
  const sql = database();
  if (!sql) {
    const items = legacyMessages().reverse();
    return { items: items.slice(0, 100), total: items.length };
  }
  try {
    const [rows, count] = await sql.transaction([
      sql`SELECT payload FROM mert_contact_messages ORDER BY created_at DESC LIMIT 100`,
      sql`SELECT COUNT(*)::integer AS total FROM mert_contact_messages`,
    ]);
    return { items: rows.map((row) => row.payload as ContactMessage), total: Number(count[0].total) };
  } catch (error) {
    if (isMissingTable(error)) {
      const items = legacyMessages().reverse();
      return { items: items.slice(0, 100), total: items.length };
    }
    throw error;
  }
}

export async function insertContact(message: ContactMessage, key: string) {
  const sql = database();
  if (!sql) throw new UserError("İletişim veritabanı henüz yapılandırılmadı.");
  const rows = await sql`WITH budget AS (
    INSERT INTO mert_contact_limits (key, hits, reset_at) VALUES (${key}, 1, now() + interval '5 minutes')
    ON CONFLICT (key) DO UPDATE SET hits = CASE WHEN mert_contact_limits.reset_at <= now() THEN 1 ELSE LEAST(mert_contact_limits.hits + 1, 6) END,
      reset_at = CASE WHEN mert_contact_limits.reset_at <= now() THEN now() + interval '5 minutes' ELSE mert_contact_limits.reset_at END
    RETURNING hits
  ) INSERT INTO mert_contact_messages (id, payload) SELECT ${message.id!}, ${JSON.stringify(message)}::jsonb FROM budget WHERE hits <= 5 RETURNING id`;
  return rows.length > 0;
}
