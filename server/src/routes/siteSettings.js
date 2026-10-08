import { Router } from "express";
import supabase, { toCamel } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const homeDefaults = {
  titleLine1: "CODEOPS",
  titleLine2: "Cyber Operations",
  titleLine3: "Command Centre",
  description: "A command centre for builders, competitors, and operators. Learn, build, compete, and lead — every mission logged, every agent ranked.",
  joinLabel: "Join Mission",
  eventsLabel: "Explore Events",
  agentsLabel: "Access Database",
};

const defaults = {
  home: true,
  stats: true,
  missionControl: true,
  events: true,
  notifications: true,
  agents: true,
  leaderboard: true,
  gallery: true,
  posters: true,
  contact: true,
};

router.get("/", async (_req, res) => {
  const { data: item, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  if (error) return res.status(500).json({ message: error.message });
  res.json({
    home: { ...homeDefaults, ...(item?.home || {}) },
    sections: { ...defaults, ...(item?.sections || {}) },
  });
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const home = { ...homeDefaults, ...(req.body?.home || {}) };
    const sections = { ...defaults, ...(req.body?.sections || {}) };
    const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
    const query = existing
      ? supabase.from("site_settings").update({ home, sections }).eq("id", existing.id)
      : supabase.from("site_settings").insert({ home, sections });
    const { data, error } = await query.select("*").single();
    if (error) throw error;
    res.json({ ...toCamel(data), home, sections });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
