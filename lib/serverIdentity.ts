import { cookies } from "next/headers";
import { demoToStored } from "./demoMode";
import { getStoredIdentity } from "./kv";
import { parsePlayParam } from "./playIdentity";
import type { StoredIdentity } from "./types";

/**
 * For Node route handlers: demo (curated) > play (query or cookie) > KV.
 */
export async function resolveVisitorIdentity(
  visitorId: string,
  searchParams: URLSearchParams
): Promise<StoredIdentity | null> {
  const demo = searchParams.get("demo");
  if (demo) {
    const st = demoToStored(visitorId, demo);
    if (st) return st;
  }
  const playQ =
    searchParams.get("play") ?? cookies().get("play_session")?.value;
  if (playQ) {
    const s = parsePlayParam(playQ, visitorId);
    if (s) return s;
  }
  return getStoredIdentity(visitorId);
}
