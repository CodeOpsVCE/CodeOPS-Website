import supabase from "./supabase.js";

export async function connectDB() {
  const { error } = await supabase.from("site_settings").select("id").limit(1);
  if (error) throw new Error(`Supabase connection failed: ${error.message}`);
  console.log("Supabase connected");
}
