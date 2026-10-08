import { Router } from "express";
import bcrypt from "bcryptjs";
import supabase, { toCamel } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function requireSuperadmin(req, res, next) {
  if (req.admin?.role !== "superadmin") return res.status(403).json({ message: "Superadmin access required" });
  next();
}

router.get("/", requireAuth, requireSuperadmin, async (_req, res) => {
  const { data, error } = await supabase.from("admins").select("id,username,role,created_at").order("created_at", { ascending: true });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data.map(toCamel));
});

router.post("/", requireAuth, requireSuperadmin, async (req, res) => {
  try {
    const username = req.body.username?.trim().toLowerCase();
    const password = req.body.password;
    if (!username || !password) return res.status(400).json({ message: "Username and password are required" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const { data: exists, error: existsError } = await supabase.from("admins").select("id").eq("username", username).maybeSingle();
    if (existsError) throw existsError;
    if (exists) return res.status(409).json({ message: "Username already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const { data: admin, error } = await supabase.from("admins").insert({
      username, password_hash: passwordHash, role: "admin"
    }).select("id,username,role,created_at").single();
    if (error) throw error;

    res.status(201).json(toCamel(admin));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", requireAuth, requireSuperadmin, async (req, res) => {
  if (req.params.id === req.admin.id) return res.status(400).json({ message: "You cannot remove your own account" });

  const { data, error } = await supabase.from("admins").delete().eq("id", req.params.id).select("id").maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!data) return res.status(404).json({ message: "Admin not found" });
  res.json({ message: "Admin removed" });
});

export default router;
