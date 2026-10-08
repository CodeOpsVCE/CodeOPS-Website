import { useState } from "react";
import { Eye, EyeOff, ExternalLink, Pencil, X } from "lucide-react";
import { api } from "../../lib/api";

const EDITORS = {
  home: "home",
  events: "events",
  agents: "agents",
  leaderboard: "leaderboard",
  gallery: "gallery",
  posters: "posters",
  contact: "contact",
  media: "media",
  stats: "stats",
};

export default function AdminSectionControls({ sectionKey, label, visible, sections, setSections }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const editorTab = EDITORS[sectionKey];

  async function toggleVisibility() {
    setSaving(true);
    const next = { ...sections, [sectionKey]: !visible };
    try {
      const saved = await api.siteSettings.update(next);
      setSections(saved.sections);
      setOpen(false);
    } catch (e) {
      window.alert(e?.message || "Unable to update section visibility.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#00FF88]/50 bg-black/80 text-[#00FF88] font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-[#00FF88] hover:text-black transition shadow-[0_0_12px_rgba(0,255,136,0.12)]"
        >
          <Pencil size={12} />
          Edit
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-sm glass rounded-xl border border-[#00FF88]/30 p-5 shadow-[0_0_30px_rgba(0,255,136,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="font-display text-sm text-[#00FF88]">EDIT {label.toUpperCase()}</div>
                <div className="text-[10px] text-white/40 mt-1">ADMIN CONTROLS</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {editorTab ? (
                <a
                  href={`/admin?tab=${editorTab}`}
                  className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded border border-[#00D9FF]/40 text-[#00D9FF] hover:bg-[#00D9FF]/10 transition font-mono text-xs uppercase"
                >
                  <span>Add / Edit {label}</span>
                  <ExternalLink size={14} />
                </a>
              ) : null}

              <button
                type="button"
                disabled={saving}
                onClick={toggleVisibility}
                className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded border transition font-mono text-xs uppercase disabled:opacity-50 ${
                  visible
                    ? "border-[#FF3B3B]/40 text-[#FF3B3B] hover:bg-[#FF3B3B]/10"
                    : "border-[#00FF88]/40 text-[#00FF88] hover:bg-[#00FF88]/10"
                }`}
              >
                <span>{saving ? "Saving..." : visible ? `Hide ${label}` : `Show ${label}`}</span>
                {visible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
