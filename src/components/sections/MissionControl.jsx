import { BookOpen, Hammer, Trophy, Lightbulb, Users } from "lucide-react";
import HexPanel from "../ui/HexPanel";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const panels = [
  { icon: BookOpen, title: "Learn", desc: "Structured tracks from fundamentals to advanced systems, taught by senior agents.", accent: "#00FF88" },
  { icon: Hammer, title: "Build", desc: "Ship real projects — apps, tools, and infra used by the club itself.", accent: "#00D9FF" },
  { icon: Trophy, title: "Compete", desc: "CP rounds, hackathons, and CTFs with a live leaderboard tracking every mission.", accent: "#FF3B3B" },
  { icon: Lightbulb, title: "Innovate", desc: "Pitch and prototype ideas with dedicated build sprints and mentor review.", accent: "#00FF88" },
  { icon: Users, title: "Lead", desc: "Run a division, mentor recruits, and shape the club's technical direction.", accent: "#00D9FF" },
];

export default function MissionControl() {
  return (
    <section id="mission-control" className="relative py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading title="Mission Control" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4">
            {panels.map((p) => (
              <HexPanel key={p.title} {...p} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}