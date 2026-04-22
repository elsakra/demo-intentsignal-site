import { kv } from "@vercel/kv";
import { z } from "zod";
import type { PersonProfile, StoredIdentity } from "./types";

const storedSchema = z.object({
  version: z.number(),
  visitorId: z.string(),
  company: z.object({
    name: z.string(),
    domain: z.string().optional(),
    industry: z.string(),
    employees: z.number().nullable(),
    technologies: z.array(z.string()),
    recentNews: z.string().nullable(),
  }),
  person: z
    .object({
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      title: z.string().nullable(),
      email: z.string().nullable(),
    })
    .nullable(),
  source: z.enum(["ip", "rb2b", "demo"]),
  updatedAt: z.string(),
  archetype: z.string(),
  hasPerson: z.boolean(),
});

const key = (visitorId: string) => `visitor:${visitorId}`;

function isKvConfigured() {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

export async function getStoredIdentity(
  visitorId: string
): Promise<StoredIdentity | null> {
  if (!isKvConfigured()) return null;
  try {
    const raw = await kv.get<string | Record<string, unknown>>(key(visitorId));
    if (!raw) return null;
    const o = typeof raw === "string" ? JSON.parse(raw) : raw;
    const p = storedSchema.safeParse(o);
    if (!p.success) {
      console.warn("kv: invalid shape", p.error);
      return null;
    }
    return p.data as StoredIdentity;
  } catch (e) {
    console.warn("kv get", e);
    return null;
  }
}

export async function setStoredIdentity(identity: StoredIdentity): Promise<void> {
  if (!isKvConfigured()) return;
  try {
    await kv.set(key(identity.visitorId), JSON.stringify(identity));
  } catch (e) {
    console.warn("kv set", e);
  }
}

export async function patchPerson(
  visitorId: string,
  person: PersonProfile
): Promise<StoredIdentity | null> {
  const cur = await getStoredIdentity(visitorId);
  if (!cur) {
    return null;
  }
  const next: StoredIdentity = {
    ...cur,
    person,
    hasPerson: true,
    version: cur.version + 1,
    source: "rb2b",
    updatedAt: new Date().toISOString(),
  };
  await setStoredIdentity(next);
  return next;
}

export function kvReady(): boolean {
  return isKvConfigured();
}
