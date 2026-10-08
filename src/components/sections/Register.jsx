import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import GlowCard from "../ui/GlowCard";
import Reveal from "../ui/Reveal";
import { registerCards } from "../../data/misc";

export default function Register() {
  return (
    <section id="register" className="relative py-24 px-4 md:px-8 bg-[#070707]">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading title="Register" />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {registerCards.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08}>
              <GlowCard className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base text-[#00FF88] mb-2">{r.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-6">{r.desc}</p>
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#00FF88] text-black font-mono text-xs font-bold uppercase tracking-wider box-glow-neon hover:brightness-110 transition">
                  Register <ArrowUpRight size={14} />
                </a>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}