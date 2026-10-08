import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default supabase;

export function toCamel(row) {
  if (!row) return row;
  const result = { ...row };
  if (result.id) result._id = result.id;
  for (const [snake, camel] of [
    ["roll_number", "rollNumber"],
    ["display_order", "displayOrder"],
    ["ongoing_since", "ongoingSince"],
    ["register_url", "registerUrl"],
    ["download_url", "downloadUrl"],
    ["faculty_coordinator", "facultyCoordinator"],
    ["map_url", "mapUrl"],
    ["password_hash", "passwordHash"],
    ["created_at", "createdAt"],
    ["updated_at", "updatedAt"],
    ["threat_class", "threatClass"],
    ["active_agents", "activeAgents"],
    ["community_members", "communityMembers"],
    ["projects_completed", "projectsCompleted"],
    ["workshops_conducted", "workshopsConducted"],
    ["hackathons_organised", "hackathonsOrganised"]
  ]) {
    if (snake in result) {
      result[camel] = result[snake];
      delete result[snake];
    }
  }
  return result;
}

export function toSnake(row) {
  if (!row) return row;
  const result = { ...row };
  for (const [camel, snake] of [
    ["rollNumber", "roll_number"], ["displayOrder", "display_order"], ["ongoingSince", "ongoing_since"],
    ["registerUrl", "register_url"], ["downloadUrl", "download_url"], ["facultyCoordinator", "faculty_coordinator"],
    ["mapUrl", "map_url"], ["passwordHash", "password_hash"], ["threatClass", "threat_class"],
    ["activeAgents", "active_agents"], ["communityMembers", "community_members"], ["projectsCompleted", "projects_completed"],
    ["workshopsConducted", "workshops_conducted"], ["hackathonsOrganised", "hackathons_organised"],
    ["createdAt", "created_at"], ["updatedAt", "updated_at"]
  ]) {
    if (camel in result) { result[snake] = result[camel]; delete result[camel]; }
  }
  delete result._id;
  return result;
}

export function toCamelRows(rows = []) {
  return rows.map(toCamel);
}
