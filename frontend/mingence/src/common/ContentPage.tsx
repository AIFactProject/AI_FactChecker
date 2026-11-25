import type { ReactNode } from "react";
export function ContentPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="content-page">
      <article>
        <span className="section-label">{eyebrow}</span>
        <h1>{title}</h1>
        <div className="content-body">{children}</div>
      </article>
    </main>
  );
}
