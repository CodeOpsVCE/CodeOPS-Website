import { Link } from "react-scroll";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaDiscord } from "react-icons/fa";
import { navLinks } from "../../data/misc";

export default function Footer({ sections, admin }) {
  const visibleLinks = navLinks.filter((link) => admin || !sections || sections[link.section || link.to] !== false);
  return (
    <footer id="footer" className="border-t border-[#00FF88]/15 bg-[#030303] px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-xs text-[#00FF88] mb-6">
          <span className="text-white/40">$ </span>
          SYSTEM ONLINE <span className="cursor-blink">▌</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="font-display text-[#00FF88] tracking-widest mb-3">CODEOPS</div>
            <p className="text-white/50 text-xs leading-relaxed">
              Cyber Operations Command Centre — A Vardhaman coding club for builders,
              competitors, and operators.
            </p>
          </div>

          <div>
            <div className="text-white/70 uppercase text-xs tracking-widest mb-3">Quick Access</div>
            <div className="flex flex-col gap-2 text-xs">
              {visibleLinks.slice(0, 6).map((l) => (
                <Link key={l.to} to={l.to} smooth duration={600} offset={-70} className="text-white/50 hover:text-[#00FF88] cursor-pointer">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white/70 uppercase text-xs tracking-widest mb-3">Admin Access</div>
            <a href="/admin" className="text-xs text-white/50 hover:text-[#00FF88] transition">Open Admin Login →</a>
          </div>

          <div>
            <div className="text-white/70 uppercase text-xs tracking-widest mb-3">Comms</div>
            <div className="flex gap-4 text-white/50">
              <a href="#" target="_blank" aria-label="FaceBook" className="hover:text-[#00FF88]"><FaFacebookF size={18} /></a>
              <a href="#" target="_blank" aria-label="LinkedIn" className="hover:text-[#00FF88]"><FaLinkedinIn size={18} /></a>
              <a href="https://www.instagram.com/codex_vce?igsh=NThkcDF1bXhhbHY3" target="_blank" aria-label="Instagram" className="hover:text-[#00FF88]"><FaInstagram size={18} /></a>
              <a href="#" target="_blank" aria-label="Discord" className="hover:text-[#00FF88]"><FaDiscord size={18} /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-white/30 font-mono">
          <div>© {new Date().getFullYear()} CODEOPS. All transmissions logged.</div>
          <div>Built by Sai Kalyan V</div>
        </div>
      </div>
    </footer>
  );
}
