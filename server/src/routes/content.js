import { Router } from "express";
import supabase, { toCamel, toCamelRows, toSnake } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `media-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const publicUrl = (file) => `/uploads/${file.filename}`;

const TABLES = {
  alert: "alerts",
  leaderboard: "leaderboard",
  agent: "agents",
  gallery: "gallery",
  poster: "posters",
};

function cleanAgent(row) {
  return {
    roll_number: String(row?.rollNumber || "").trim(),
    name: String(row?.name || "").trim(),
    department: String(row?.department || "").trim(),
    position: String(row?.position || "").trim(),
    language: String(row?.language || "").trim(),
    github: String(row?.github || "").trim() || "#",
    linkedin: String(row?.linkedin || "").trim() || "#",
    portfolio: String(row?.portfolio || "").trim() || "#",
    photo: String(row?.photo || "").trim(),
  };
}

async function nextEventCode() {
  const { data, error } = await supabase.from("events").select("code").like("code", "CO-%");
  if (error) throw error;
  const used = new Set((data || []).map((item) => Number(String(item.code).slice(3))));
  let n = 1;
  while (used.has(n)) n += 1;
  return `CO-${String(n).padStart(3, "0")}`;
}

function crud(table, sortColumn = "created_at", ascending = false) {
  router.get(`/${table === "alerts" ? "alert" : table}`, async (_req, res) => {
    const { data, error } = await supabase.from(table).select("*").order(sortColumn, { ascending });
    if (error) return res.status(500).json({ message: error.message });
    res.json(toCamelRows(data));
  });

  router.post(`/${table === "alerts" ? "alert" : table}`, requireAuth, async (req, res) => {
    try {
      const { data, error } = await supabase.from(table).insert(toSnake(req.body)).select("*").single();
      if (error) throw error;
      res.status(201).json(toCamel(data));
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });

  router.put(`/${table === "alerts" ? "alert" : table}/:id`, requireAuth, async (req, res) => {
    try {
      const { data, error } = await supabase.from(table).update(toSnake(req.body)).eq("id", req.params.id).select("*").maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Not found" });
      res.json(toCamel(data));
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });

  router.delete(`/${table === "alerts" ? "alert" : table}/:id`, requireAuth, async (req, res) => {
    const { data, error } = await supabase.from(table).delete().eq("id", req.params.id).select("id").maybeSingle();
    if (error) return res.status(400).json({ message: error.message });
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  });
}

router.get("/event", async (_req, res) => {
  try {
    const now = new Date();
    const { data: events, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (error) throw error;

    for (const event of events || []) {
      if (event.status === "OPEN" && new Date(event.deadline) <= now) {
        const { error: updateError } = await supabase.from("events").update({
          status: "ONGOING",
          ongoing_since: now.toISOString(),
        }).eq("id", event.id);
        if (updateError) throw updateError;
        event.status = "ONGOING";
        event.ongoing_since = now.toISOString();
      } else if (
        event.status === "ONGOING" &&
        event.ongoing_since &&
        new Date(event.ongoing_since) <= new Date(now.getTime() - 24 * 60 * 60 * 1000)
      ) {
        const { error: updateError } = await supabase.from("events").update({ status: "CLOSED" }).eq("id", event.id);
        if (updateError) throw updateError;
        event.status = "CLOSED";
      }
    }

    res.json(toCamelRows(events));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/agents/reorder", requireAuth, async (req, res) => {
  try {
    const order = Array.isArray(req.body?.order) ? req.body.order : [];
    for (let index = 0; index < order.length; index += 1) {
      const { error } = await supabase.from("agents").update({ display_order: index }).eq("id", order[index]);
      if (error) throw error;
    }
    const { data, error } = await supabase.from("agents").select("*").order("display_order", { ascending: true, nullsFirst: false }).order("created_at", { ascending: true });
    if (error) throw error;
    res.json(toCamelRows(data));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/agents/import", requireAuth, async (req, res) => {
  try {
    if (!Array.isArray(req.body?.agents)) return res.status(400).json({ message: "agents must be an array" });
    const rows = req.body.agents;
    const valid = [];
    const seen = new Set();

    for (const row of rows) {
      const rollNumber = String(row?.rollNumber || "").trim();
      const name = String(row?.name || "").trim();
      if (!rollNumber || !name) continue;
      const key = rollNumber.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      valid.push(cleanAgent(row));
    }

    if (!valid.length) return res.status(201).json({ created: 0, ignored: rows.length });

    const { data: existing, error: existingError } = await supabase
      .from("agents").select("roll_number").in("roll_number", valid.map((item) => item.roll_number));
    if (existingError) throw existingError;

    const existingRollNumbers = new Set((existing || []).map((item) => item.roll_number.toLowerCase()));
    const toCreate = valid.filter((item) => !existingRollNumbers.has(item.roll_number.toLowerCase()));

    if (toCreate.length) {
      const { error } = await supabase.from("agents").insert(toCreate);
      if (error) throw error;
    }

    res.status(201).json({ created: toCreate.length, ignored: rows.length - toCreate.length });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/event", requireAuth, upload.single("poster"), async (req, res) => {
  try {
    if (req.file) {
      const url = publicUrl(req.file);
      await supabase.from("media").insert({ title: req.body.title || req.file.originalname, url, kind: "poster" });
      req.body.poster = url;
    }
    if (!req.body.code?.trim()) req.body.code = await nextEventCode();

    const payload = {
      code: req.body.code.trim(),
      title: req.body.title,
      poster: req.body.poster || "",
      description: req.body.description,
      venue: req.body.venue,
      deadline: req.body.deadline,
      status: req.body.status || "OPEN",
      ongoing_since: req.body.status === "ONGOING" ? new Date().toISOString() : null,
      register_url: req.body.registerUrl || "",
    };
    const { data, error } = await supabase.from("events").insert(payload).select("*").single();
    if (error) throw error;
    res.status(201).json(toCamel(data));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put("/event/:id", requireAuth, upload.single("poster"), async (req, res) => {
  try {
    if (req.file) {
      const url = publicUrl(req.file);
      await supabase.from("media").insert({ title: req.body.title || req.file.originalname, url, kind: "poster" });
      req.body.poster = url;
    }
    if (!req.file && !req.body.poster) delete req.body.poster;
    if (!req.body.code?.trim()) req.body.code = await nextEventCode();

    const { data: existing, error: existingError } = await supabase.from("events").select("status, ongoing_since").eq("id", req.params.id).maybeSingle();
    if (existingError) throw existingError;
    if (!existing) return res.status(404).json({ message: "Not found" });

    const payload = {
      ...(req.body.code ? { code: req.body.code.trim() } : {}),
      ...(req.body.title !== undefined ? { title: req.body.title } : {}),
      ...(req.body.poster !== undefined ? { poster: req.body.poster } : {}),
      ...(req.body.description !== undefined ? { description: req.body.description } : {}),
      ...(req.body.venue !== undefined ? { venue: req.body.venue } : {}),
      ...(req.body.deadline !== undefined ? { deadline: req.body.deadline } : {}),
      ...(req.body.status !== undefined ? { status: req.body.status } : {}),
      ...(req.body.registerUrl !== undefined ? { register_url: req.body.registerUrl } : {}),
    };

    if (req.body.status === "ONGOING") {
      payload.ongoing_since = existing.status !== "ONGOING" || !existing.ongoing_since
        ? new Date().toISOString()
        : existing.ongoing_since;
    } else if (req.body.status && req.body.status !== "ONGOING") {
      payload.ongoing_since = null;
    }

    const { data, error } = await supabase.from("events").update(payload).eq("id", req.params.id).select("*").single();
    if (error) throw error;
    res.json(toCamel(data));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/event/:id", requireAuth, async (req, res) => {
  const { data, error } = await supabase.from("events").delete().eq("id", req.params.id).select("id").maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!data) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
});

crud("alerts");
crud("leaderboard", "xp", false);
crud("agents");
crud("gallery");
crud("posters");

router.get("/contact", async (_req, res) => {
  const { data, error } = await supabase.from("contact").select("*").limit(1).maybeSingle();
  if (error) return res.status(500).json({ message: error.message });
  res.json(toCamel(data) || {});
});

router.put("/contact", requireAuth, async (req, res) => {
  try {
    const { data: existing, error: existingError } = await supabase.from("contact").select("id").limit(1).maybeSingle();
    if (existingError) throw existingError;
    const { data, error } = existing
      ? await supabase.from("contact").update(req.body).eq("id", existing.id).select("*").single()
      : await supabase.from("contact").insert(req.body).select("*").single();
    if (error) throw error;
    res.json(toCamel(data));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get("/media", requireAuth, async (_req, res) => {
  const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(toCamelRows(data));
});

router.post("/media", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required" });
    const { data, error } = await supabase.from("media").insert({
      title: req.body.title || req.file.originalname,
      url: publicUrl(req.file),
      kind: req.body.kind === "poster" ? "poster" : "image",
    }).select("*").single();
    if (error) throw error;
    res.status(201).json(toCamel(data));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/media/:id", requireAuth, async (req, res) => {
  const { data: media, error: mediaError } = await supabase.from("media").select("*").eq("id", req.params.id).maybeSingle();
  if (mediaError) return res.status(400).json({ message: mediaError.message });
  if (!media) return res.status(404).json({ message: "Not found" });

  const [event, gallery, poster, agent] = await Promise.all([
    supabase.from("events").select("id").eq("poster", media.url).limit(1),
    supabase.from("gallery").select("id").eq("img", media.url).limit(1),
    supabase.from("posters").select("id").eq("img", media.url).limit(1),
    supabase.from("agents").select("id").eq("photo", media.url).limit(1),
  ]);
  if (event.error || gallery.error || poster.error || agent.error) {
    return res.status(400).json({ message: "Could not verify media references" });
  }
  if (event.data?.length || gallery.data?.length || poster.data?.length || agent.data?.length) {
    return res.status(409).json({ message: "This media is still in use. Reassign it before deleting." });
  }

  const { error } = await supabase.from("media").delete().eq("id", req.params.id);
  if (error) return res.status(400).json({ message: error.message });
  if (media.url.startsWith("/uploads/")) {
    fs.rm(path.join(uploadDir, path.basename(media.url)), { force: true }, () => {});
  }
  res.json({ message: "Deleted" });
});

router.get("/stats", async (_req, res) => {
  const [{ data: stats }, { count: totalAgents }, { data: leaderboard }] = await Promise.all([
    supabase.from("stats").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("agents").select("id", { count: "exact", head: true }),
    supabase.from("leaderboard").select("xp"),
  ]);
  const totalXpEarned = (leaderboard || []).reduce((sum, item) => sum + Number(item.xp || 0), 0);

  res.json({
    activeAgents: totalAgents || 0,
    communityMembers: stats?.community_members || 0,
    projectsCompleted: stats?.projects_completed || 0,
    workshopsConducted: stats?.workshops_conducted || 0,
    hackathonsOrganised: stats?.hackathons_organised || 0,
    totalXpEarned,
  });
});

router.put("/stats", requireAuth, async (req, res) => {
  try {
    const { data: existing } = await supabase.from("stats").select("id").limit(1).maybeSingle();
    const payload = {
      active_agents: Number(req.body.activeAgents ?? 0),
      community_members: Number(req.body.communityMembers ?? 0),
      projects_completed: Number(req.body.projectsCompleted ?? 0),
      workshops_conducted: Number(req.body.workshopsConducted ?? 0),
      hackathons_organised: Number(req.body.hackathonsOrganised ?? 0),
    };
    const query = existing
      ? supabase.from("stats").update(payload).eq("id", existing.id)
      : supabase.from("stats").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) throw error;
    res.json(toCamel(data));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
