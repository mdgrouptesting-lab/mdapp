/** Tiny, safe renderer for blog content: "## Heading", "### Sub", "- bullet", blank-line paragraphs, **bold**. */
function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>));
}

export function PostContent({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-5 text-lg leading-relaxed text-navy-700">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (!t) return null;
        if (t.startsWith("### ")) return <h3 key={i} className="pt-2 text-xl font-bold text-navy-900">{inline(t.slice(4))}</h3>;
        if (t.startsWith("## ")) return <h2 key={i} className="pt-4 text-2xl font-bold text-navy-900">{inline(t.slice(3))}</h2>;
        const lines = t.split("\n");
        if (lines.every((l) => /^[-*] /.test(l.trim())))
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 marker:text-brand-500">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.trim().slice(2))}</li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {inline(l)}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
