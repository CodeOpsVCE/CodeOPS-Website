import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import supabase, { toCamel } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

    const { data: admin, error } = await supabase.from("admins").select("*").eq("username", username.toLowerCase().trim()).maybeSingle();
    if (error) throw error;
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie("codeops_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE === "true",
      path: "/",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({ admin: { id: admin.id, username: admin.username, role: admin.role } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("codeops_token", { path: "/" });
  res.json({ message: "Logged out" });
});

router.get("/me", requireAuth, async (req, res) => {
  const { data: admin, error } = await supabase.from("admins").select("id,username,role,created_at").eq("id", req.admin.id).maybeSingle();
  if (error || !admin) return res.status(401).json({ message: "Admin not found" });
  res.json({ admin: toCamel(admin) });
});

export default router;
