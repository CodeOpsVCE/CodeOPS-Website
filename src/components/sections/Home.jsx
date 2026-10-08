import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import { ShieldCheck, Rocket, Database } from "lucide-react";
import RadarSweep from "../ui/RadarSweep";
import TerminalTyper from "../ui/TerminalTyper";
import { api } from "../../lib/api";

const defaultHome = {
  titleLine1: "CODEOPS",
  titleLine2: "Cyber Operations",
  titleLine3: "Command Centre",
  description: "{content.description}",
  joinLabel: "Join Mission",
  eventsLabel: "Explore Events",
  agentsLabel: "Access Database",
};

export default function Home() {
  const [content, setContent] = useState(defaultHome);
  useEffect(() => {
    api.siteSettings.get().then((settings) => {
      if (settings?.home) setContent((current) => ({ ...current, ...settings.home }));
    }).catch(() => {});
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="scanline" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-10 items-center w-full">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display font-black text-4xl md:text-6xl leading-tight text-white uppercase">
            <span className="text-[#00FF88] text-glow">{content.titleLine1}</span><br />
            {content.titleLine2}<br />{content.titleLine3}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-6 text-white/60 max-w-md text-sm md:text-base">
            A command centre for builders, competitors, and operators. Learn, build, compete, and lead — every mission logged, every agent ranked.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 flex flex-wrap gap-4">
            <Link to="events" smooth duration={600} offset={-70} className="cursor-pointer px-6 py-3 rounded-md font-mono text-xs uppercase tracking-wider bg-[#00FF88] text-black font-bold box-glow-neon hover:brightness-110 transition flex items-center gap-2"><Rocket size={14} /> {content.joinLabel}</Link>
            <Link to="events" smooth duration={600} offset={-70} className="cursor-pointer px-6 py-3 rounded-md font-mono text-xs uppercase tracking-wider border border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF]/10 transition flex items-center gap-2"><ShieldCheck size={14} /> {content.eventsLabel}</Link>
            <Link to="agents" smooth duration={600} offset={-70} className="cursor-pointer px-6 py-3 rounded-md font-mono text-xs uppercase tracking-wider border border-white/20 text-white/80 hover:border-[#00FF88] hover:text-[#00FF88] transition flex items-center gap-2"><Database size={14} /> {content.agentsLabel}</Link>
          </motion.div>
        </div>
        <div className="flex flex-col items-center gap-8">
          <div className="hidden md:block"><RadarSweep /></div>
          <TerminalTyper />
        </div>
      </div>
    </section>
  );
}