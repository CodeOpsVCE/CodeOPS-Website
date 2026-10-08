import { useEffect, useRef, useState } from "react";
import BootSequence from "./components/boot/BootSequence";
import MatrixRain from "./components/ui/MatrixRain";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./components/sections/Home";
import StatsDashboard from "./components/sections/StatsDashboard";
import MissionControl from "./components/sections/MissionControl";
import Events from "./components/sections/Events";
import AlertConsole from "./components/sections/AlertConsole";
import AgentDatabase from "./components/sections/AgentDatabase";
import Leaderboard from "./components/sections/Leaderboard";
import Gallery from "./components/sections/Gallery";
import Posters from "./components/sections/Posters";
import Contact from "./components/sections/Contact";
import AdminPanel from "./components/admin/AdminPanel";
import AdminSectionControls from "./components/admin/AdminSectionControls";
import { api } from "./lib/api";

export default function App() {
  const audioRef = useRef(null);
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem("skipCodeOpsBoot") === "1";
    } catch {
      return false;
    }
  });
  const [sections, setSections] = useState({ home:true, stats:true, missionControl:true, events:true, notifications:true, agents:true, leaderboard:true, gallery:true, posters:true, contact:true });
  const [admin, setAdmin] = useState(null);
  const [audioMuted, setAudioMuted] = useState(true);
  const isAdminRoute = window.location.pathname === "/admin";

  useEffect(() => {
    try {
      if (booted) sessionStorage.removeItem("skipCodeOpsBoot");
    } catch {}
  }, [booted]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setAudioMuted(false);
      return;
    }

    const audio = new Audio("/bgm1.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    audio.play().then(() => setAudioMuted(false)).catch(() => {
      audioRef.current = null;
      setAudioMuted(true);
    });
  };

  const handleAudioChoice = (enabled) => {
    if (enabled) {
      startAudio();
    } else {
      setAudioMuted(true);
    }
  };

  const handleAudioToggle = () => {
    if (audioMuted) {
      startAudio();
    } else if (audioRef.current) {
      audioRef.current.muted = true;
      setAudioMuted(true);
    }
  };

  useEffect(() => {
    api.siteSettings.get().then((data) => setSections(data.sections)).catch(() => {});
    api.me().then((data) => setAdmin(data.admin || null)).catch(() => setAdmin(null));
  }, []);

  if (isAdminRoute) return <AdminPanel />;

  if (!booted) {
    return (
      <BootSequence
        onAudioChoice={handleAudioChoice}
        onDone={() => setBooted(true)}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 opacity-25 pointer-events-none z-0">
        <MatrixRain />
      </div>
      <Navbar sections={sections} admin={admin} onLogout={() => setAdmin(null)} audioMuted={audioMuted} onAudioToggle={handleAudioToggle} />
      <main>
        <AdminManagedSection sectionKey="home" label="Home" visible={sections.home} admin={admin} sections={sections} setSections={setSections}>
          <Home />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="stats" label="Stats Dashboard" visible={sections.stats} admin={admin} sections={sections} setSections={setSections}>
          <StatsDashboard />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="missionControl" label="Mission Control" visible={sections.missionControl} admin={admin} sections={sections} setSections={setSections}>
          <MissionControl />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="events" label="Events" visible={sections.events} admin={admin} sections={sections} setSections={setSections}>
          <Events />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="notifications" label="Notifications" visible={sections.notifications} admin={admin} sections={sections} setSections={setSections}>
          <AlertConsole />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="agents" label="Agent Database" visible={sections.agents} admin={admin} sections={sections} setSections={setSections}>
          <AgentDatabase />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="leaderboard" label="Leaderboard" visible={sections.leaderboard} admin={admin} sections={sections} setSections={setSections}>
          <Leaderboard />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="gallery" label="Gallery" visible={sections.gallery} admin={admin} sections={sections} setSections={setSections}>
          <Gallery />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="posters" label="Posters" visible={sections.posters} admin={admin} sections={sections} setSections={setSections}>
          <Posters />
        </AdminManagedSection>
        <AdminManagedSection sectionKey="contact" label="Contact" visible={sections.contact} admin={admin} sections={sections} setSections={setSections}>
          <Contact />
        </AdminManagedSection>
      </main>
      <Footer sections={sections} admin={admin} />
    </>
  );
}

function AdminManagedSection({ sectionKey, label, visible, admin, sections, setSections, children }) {
  if (!visible && !admin) return null;

  const isHiddenForPublic = !visible;
  return (
    <div className="relative">
      {admin ? (
        <AdminSectionControls
          sectionKey={sectionKey}
          label={label}
          visible={visible}
          sections={sections}
          setSections={setSections}
        />
      ) : null}
      <div className={isHiddenForPublic ? "grayscale opacity-40" : ""}>
        {isHiddenForPublic ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="border border-[#FF3B3B]/50 bg-black/80 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3B3B] shadow-[0_0_15px_rgba(255,59,59,0.15)]">
              Not visible to public
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
