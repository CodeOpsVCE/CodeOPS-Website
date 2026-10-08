import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import adminRoutes from "./routes/admin.js";
import siteSettingsRoutes from "./routes/siteSettings.js";
import { seedDefaultContent } from "./scripts/seedContent.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
const uploadDir = path.join(__dirname, "../uploads");
const legacyUploadDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadDir));
app.use("/uploads", express.static(legacyUploadDir));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "CodeOPS API" }));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api", contentRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

connectDB()
  .then(() => seedDefaultContent())
  .then(() => app.listen(PORT, () => console.log(`CodeOPS API running on http://localhost:${PORT}`)))
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
