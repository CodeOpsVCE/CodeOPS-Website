import { useEffect, useRef } from "react";

export default function MatrixRain({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, columns, drops;
    const chars = "01アイウエオカキクVSKケ420コサシスセソ<>{}/#$";
    const fontSize = 16;

    const isMobile = window.innerWidth < 768;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      columns = Math.floor(width / fontSize / (isMobile ? 1.5 : 1));
      drops = new Array(columns).fill(1);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf;
    function draw() {
      ctx.fillStyle = "rgba(5,5,5,0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.97 ? "#00D9FF" : "#00FF88";
        ctx.globalAlpha = 0.55;
        ctx.fillText(text, i * fontSize * (isMobile ? 1.5 : 1), drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}