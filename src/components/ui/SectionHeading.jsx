export default function SectionHeading({ eyebrow, title, accent = "#00FF88" }) {
  return (
    <div className="text-center mb-12">
      <div
        className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
        style={{ color: accent }}
      >
        {eyebrow}
      </div>
      <h2 className="font-display text-2xl md:text-4xl font-bold text-white uppercase tracking-wider">
        {title}
      </h2>
      <div
        className="h-[2px] w-20 mx-auto mt-4"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
    </div>
  );
}