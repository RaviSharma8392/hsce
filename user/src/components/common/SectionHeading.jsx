export function SectionHeading({ eyebrow, title, align = "left" }) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0a4b8c] font-sans">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-[#222222]">
        {title}
      </h2>
    </div>
  );
}
