import { Fragment } from "react";

/** One *italic* span per `*...*` segment (spec: single italic per headline). */
export function formatHeroH1(
  s: string,
  className: { wrap?: string; em?: string } = {}
) {
  const parts = s.split(/(\*[^*]+\*)/g);
  return (
    <span className={className.wrap}>
      {parts.map((p, i) => {
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2) {
          return (
            <em
              key={i}
              className={className.em ?? "font-light not-italic text-signal"}
            >
              {p.slice(1, -1)}
            </em>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </span>
  );
}
