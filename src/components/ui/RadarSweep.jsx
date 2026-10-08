export default function RadarSweep({ size = 260 }) {
  return (
    <div
      className="relative rounded-full"
      style={{
        width: size,
        height: size,
        border: "1px solid rgba(0,255,136,0.25)",
        background:
          "repeating-radial-gradient(circle, rgba(0,255,136,0.06) 0, rgba(0,255,136,0.06) 1px, transparent 1px, transparent calc(12.5% ))",
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, rgba(0,255,136,0.55), transparent 30%)",
          animation: "spin 3.5s linear infinite",
          maskImage: "radial-gradient(circle, black 60%, transparent 100%)",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-[#00FF88]/15"
          style={{
            inset: `${i * 12}%`,
          }}
        />
      ))}
    </div>
  );
}