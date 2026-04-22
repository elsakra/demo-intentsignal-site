/**
 * Public logo endpoints only (no crawling customer sites). Used by CompanyMark
 * to swap on error.
 */
export function companyLogoCandidates(domain: string | undefined): string[] {
  if (!domain?.includes(".")) return [];
  const d = domain.replace(/^https?:\/\//, "").split("/")[0]!.replace(/^www\./, "");
  if (d.length < 4) return [];
  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
  const c: string[] = [];
  if (token) {
    c.push(
      `https://img.logo.dev/${encodeURIComponent(d)}?token=${encodeURIComponent(token)}&size=128&format=png`
    );
  }
  c.push(`https://logo.clearbit.com/${encodeURIComponent(d)}`);
  c.push(
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=128`
  );
  return c;
}

export function monogramFromName(name: string): string {
  const parts = name
    .replace(/[.,&]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  const w = name.replace(/[^a-z0-9]/gi, "");
  if (w.length >= 2) return w.slice(0, 2).toUpperCase();
  if (w.length === 1) return (w + w).toUpperCase();
  return "?";
}
