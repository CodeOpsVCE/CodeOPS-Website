import "dotenv/config";
import { MongoClient } from "mongodb";
import supabase, { toSnake } from "../config/supabase.js";

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || "codeops";
if (!MONGO_URI) throw new Error("MONGO_URI is required for the one-time migration");

const mappings = {
  admins: { table: "admins", unique: ["username"] },
  agents: { table: "agents", unique: ["roll_number"] },
  events: { table: "events", unique: ["code"] },
  alerts: { table: "alerts", unique: ["type", "text"] },
  leaderboard: { table: "leaderboard", unique: ["name", "nickname"] },
  gallery: { table: "gallery", unique: ["title", "category"] },
  posters: { table: "posters", unique: ["title"] },
  contact: { table: "contact", unique: [] },
  stats: { table: "stats", unique: [] },
  siteSettings: { table: "site_settings", unique: [] },
};

function normalize(value) {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      if (key === "_id" || key === "__v") continue;
      out[key] = normalize(item);
    }
    return out;
  }
  return value;
}

function transform(collection, document) {
  const row = toSnake(normalize(document));
  delete row.id;
  delete row._id;

  if (collection === "siteSettings") {
    return {
      home: row.home || {},
      sections: row.sections || {},
    };
  }

  if (collection === "contact" || collection === "stats") {
    return row;
  }

  return row;
}

async function upsert(table, row, unique) {
  if (!unique.length) {
    const { data: existing } = await supabase.from(table).select("id").limit(1).maybeSingle();
    if (existing) {
      const { error } = await supabase.from(table).update(row).eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from(table).insert(row);
      if (error) throw error;
    }
    return;
  }

  let query = supabase.from(table).select("id").limit(1);
  for (const key of unique) query = query.eq(key, row[key]);
  const { data: existing, error: lookupError } = await query.maybeSingle();
  if (lookupError) throw lookupError;

  if (existing) {
    const { error } = await supabase.from(table).update(row).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from(table).insert(row);
    if (error) throw error;
  }
}

const client = new MongoClient(MONGO_URI);
try {
  await client.connect();
  const db = client.db(MONGO_DB);

  for (const [collection, config] of Object.entries(mappings)) {
    const documents = await db.collection(collection).find({}).toArray();
    let count = 0;
    for (const document of documents) {
      await upsert(config.table, transform(collection, document), config.unique);
      count += 1;
    }
    console.log(`Migrated ${count} documents: ${collection} -> ${config.table}`);
  }

  console.log("MongoDB -> Supabase migration completed.");
} finally {
  await client.close();
}
