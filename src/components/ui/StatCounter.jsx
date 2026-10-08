import { useEffect, useRef, useState } from "react";

export default function StatCounter({ value, label }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Restart the counter whenever the server-provided value changes.
    started.current = false;
    setCount(0);

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1400;
        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <div ref={ref} className="glass rounded-xl p-6 min-w-0 text-center box-glow-neon"><div className="font-display text-3xl md:text-4xl text-glow" style={{ color: "#00FF88" }}>{count.toLocaleString()}</div><div className="mt-2 text-xs uppercase tracking-wider whitespace-nowrap text-white/60">{label}</div></div>;
}