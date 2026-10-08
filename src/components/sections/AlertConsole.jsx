import { useEffect, useState } from "react";
import { AlertTriangle, Bell, Zap, Cpu, RefreshCw } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { alerts as fallbackAlerts } from "../../data/misc";
import { api } from "../../lib/api";

const ICONS = {
  DEADLINE: AlertTriangle,
  WORKSHOP: Bell,
  HACKATHON: Zap,
  UPDATE: RefreshCw,
  SYSTEM: Cpu,
};

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AlertConsole() {
  const [alerts, setAlerts] = useState(fallbackAlerts);

  useEffect(() => {
    api.alerts?.list().then((items) => {
      if (Array.isArray(items) && items.length) setAlerts(items);
    }).catch(() => {});
  }, []);

  return (
    <section id="notifications" className="relative py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <SectionHeading title="Cyber Alert Console" accent="#FF3B3B" />
        </Reveal>
        <div className="glass rounded-xl p-2 divide-y divide-white/5">
          {alerts.map((a, i) => {
            const Icon = ICONS[a.type] || Bell;
            return (
              <Reveal key={a._id || a.id || `${a.type}-${i}`} delay={i * 0.06}>
                <div className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-[#FF3B3B]/10 text-[#FF3B3B]">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-mono text-[#FF3B3B] uppercase tracking-widest mb-0.5">{a.type}</div>
                    <div className="text-sm text-white/80">{a.text}</div>
                  </div>
                  <div className="text-[10px] font-mono text-white/30 shrink-0">{a.time || formatTime(a.createdAt)}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
