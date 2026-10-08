import { useEffect, useState } from "react";
import StatCounter from "../ui/StatCounter";
import Reveal from "../ui/Reveal";
import { api } from "../../lib/api";

const EMPTY_STATS = {
  activeAgents: 0,
  communityMembers: 0,
  projectsCompleted: 0,
  workshopsConducted: 0,
  hackathonsOrganised: 0,
  totalXpEarned: 0,
};

const STAT_FIELDS = [
  ["activeAgents", "Total Agents"],
  ["communityMembers", "Community Members"],
  ["projectsCompleted", "Projects Completed"],
  ["workshopsConducted", "Workshops Conducted"],
  ["hackathonsOrganised", "Hackathons Organised"],
  ["totalXpEarned", "Total XP Earned"],
];

export default function StatsDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);

  useEffect(() => {
    let mounted = true;
    api.stats.get().then((data) => {
      if (mounted) setStats({ ...EMPTY_STATS, ...data });
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <section className="relative py-16 px-4 md:px-8 bg-[#070707]">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STAT_FIELDS.map(([key, label]) => (
              <StatCounter key={key} value={Number(stats[key] || 0)} label={label} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
