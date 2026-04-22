/**
 * Base64url without Buffer — safe for Edge + browser + Node.
 */
export function b64uEncode(utf8: string): string {
  const bytes = new TextEncoder().encode(utf8);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 1) {
    bin += String.fromCharCode(bytes[i]!);
  }
  const b = btoa(bin);
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function b64uDecode(s: string): string {
  const pad = 4 - (s.length % 4);
  const padded = pad < 4 ? s + "====".slice(0, pad) : s;
  const b = padded.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
