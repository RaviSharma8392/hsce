export function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow ? (
        <div className={`mb-2.5 flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}>
          <span className="h-0.5 w-6 bg-[#FBDD23]" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C] font-sans">
            {eyebrow}
          </p>
        </div>
      ) : null}
      <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-[#2E3A8C] leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
