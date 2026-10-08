import { useEffect, useState } from "react";

const COMMANDS = [
  { cmd: "whoami", out: "agent@CODEOPS : clearance pending" },
  { cmd: "events", out: "3 active missions found. use `register <id>` to join." },
  { cmd: "register", out: "opening secure registration channel..." },
  { cmd: "crew", out: "128 active agents across 9 divisions." },
  { cmd: "leaderboard", out: "top agent: ZeroDay — 24,800 XP" },
  { cmd: "help", out: "available: whoami, events, register, crew, leaderboard, help" },
];

export default function TerminalTyper() {
  const [lines, setLines] = useState([]);
  const [cmdIdx, setCmdIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let charIdx = 0;
    const current = COMMANDS[cmdIdx % COMMANDS.length];

    setLines((prev) => [...prev, { cmd: "", out: "" }]);

    const typeCommand = setInterval(() => {
      if (cancelled) return;
      charIdx++;

      setLines((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          cmd: current.cmd.slice(0, charIdx),
          out: "",
        };
        return next;
      });

      if (charIdx >= current.cmd.length) {
        clearInterval(typeCommand);

        let outIdx = 0;
        const typeOutput = setInterval(() => {
          if (cancelled) {
            clearInterval(typeOutput);
            return;
          }

          outIdx++;
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              cmd: current.cmd,
              out: current.out.slice(0, outIdx),
            };
            return next;
          });

          if (outIdx >= current.out.length) {
            clearInterval(typeOutput);

            setTimeout(() => {
              if (cancelled) return;
              setLines((prev) => (prev.length > 6 ? prev.slice(1) : prev));
              setCmdIdx((i) => i + 1);
            }, 1200);
          }
        }, 40);
      }
    }, 65);

    return () => {
      cancelled = true;
      clearInterval(typeCommand);
    };
  }, [cmdIdx]);

  return (
    <div className="glass rounded-lg p-4 w-full max-w-md h-[410px] overflow-hidden text-xs md:text-sm font-mono box-glow-neon">
      <div className="flex gap-1.5 mb-3">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF3B3B" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFD400" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#00FF88" }} />
        <span className="ml-2 text-white/40">agent@CODEOPS:~</span>
      </div>
      <div className="space-y-1.5 h-[360px] overflow-hidden">
        {lines.map((l, i) => (
          <div key={i}>
            <div style={{ color: "#00FF88" }}>
              <span className="text-white/40">$ </span>
              {l.cmd}
              {i === lines.length - 1 && (l.out === "") && <span className="cursor-blink">▌</span>}
            </div>
            {l.out && <div className="text-white/50 pl-2">{l.out}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
