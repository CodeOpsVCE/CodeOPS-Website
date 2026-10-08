import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { Menu, X, Terminal, Volume2, VolumeX } from "lucide-react";
import { navLinks } from "../../data/misc";
import { api } from "../../lib/api";

export default function Navbar({ sections, admin, onLogout, audioMuted, onAudioToggle }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const visibleLinks = navLinks.filter((link) => admin || !sections || sections[link.section || link.to] !== false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold tracking-widest text-[#00FF88] text-glow">
          <Terminal size={20} />
          CODEOPS
        </div>

        <div className="hidden lg:flex items-center gap-1 font-mono text-xs uppercase tracking-wider">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              duration={600}
              offset={-70}
              spy
              onSetActive={() => setActive(link.to)}
              className={`px-3 py-2 cursor-pointer transition-colors relative ${
                active === link.to ? "text-[#00FF88]" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
              {active === link.to && (
                <span className="absolute left-2 right-2 -bottom-0.5 h-[2px] bg-[#00FF88] box-glow-neon" />
              )}
            </Link>
          ))}
        </div>

        <a href="/admin" className="hidden lg:inline-flex items-center gap-2 ml-4 px-3 py-2 border border-[#00FF88]/30 rounded text-[#00FF88] hover:bg-[#00FF88]/10 transition font-mono text-xs uppercase tracking-wider">
          ADMIN
        </a>

        <button
          type="button"
          onClick={onAudioToggle}
          className="hidden lg:inline-flex items-center gap-2 ml-2 px-3 py-2 border border-[#00FF88]/30 rounded text-[#00FF88] hover:bg-[#00FF88]/10 transition font-mono text-xs uppercase tracking-wider"
          aria-label={audioMuted ? "Unmute background music" : "Mute background music"}
          title={audioMuted ? "Unmute background music" : "Mute background music"}
        >
          {audioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span className="hidden sm:inline">{audioMuted ? "UNMUTE" : "MUTE"}</span>
        </button>

        <button
          className="lg:hidden text-[#00FF88]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass mt-2 mx-4 rounded-lg p-4 flex flex-col gap-2 font-mono text-sm uppercase">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              duration={600}
              offset={-60}
              onClick={() => setOpen(false)}
              className={`py-2 cursor-pointer ${admin && sections?.[link.section || link.to] === false ? "text-white/25" : "text-white/70 hover:text-[#00FF88]"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}