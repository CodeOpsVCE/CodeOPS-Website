import "dotenv/config";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import supabase from "../config/supabase.js";

const rl = readline.createInterface({ input, output });

try {
  const username = (await rl.question("Admin username: ")).trim().toLowerCase();
  const password = await rl.question("Admin password: ");

  if (!username || password.length < 8) {
    throw new Error("Username is required and password must be at least 8 characters");
  }

  const { data: existing, error: lookupError } = await supabase.from("admins").select("id").eq("username", username).maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) throw new Error("Admin username already exists");

  const passwordHash = await bcrypt.hash(password, 12);
  const { error } = await supabase.from("admins").insert({ username, password_hash: passwordHash, role: "superadmin" });
  if (error) throw error;

  console.log("Superadmin created.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  rl.close();
}
