import "dotenv/config";
import supabase from "../config/supabase.js";

const agents = [
  { roll_number:"001", name:"Rehan Iqbal", department:"Cyber Security", position:"S-Class Cyber Phantom", language:"Python", github:"#", linkedin:"#", portfolio:"#", photo:"https://placehold.co/200x200/050505/00FF88?text=AGT-001" },
  { roll_number:"002", name:"Ananya Rao", department:"Competitive Programming", position:"A-Class Elite Agent", language:"C++", github:"#", linkedin:"#", portfolio:"#", photo:"https://placehold.co/200x200/050505/00D9FF?text=AGT-002" },
  { roll_number:"003", name:"Kiran Vellanki", department:"Web Development", position:"B-Class Specialist", language:"TypeScript", github:"#", linkedin:"#", portfolio:"#", photo:"https://placehold.co/200x200/050505/00FF88?text=AGT-003" },
  { roll_number:"004", name:"Sneha Patil", department:"Artificial Intelligence", position:"C-Class Operator", language:"Python", github:"#", linkedin:"#", portfolio:"#", photo:"https://placehold.co/200x200/050505/00D9FF?text=AGT-004" },
  { roll_number:"005", name:"Devraj Sen", department:"Cyber Security", position:"Ω-Class Command Elite", language:"Rust", github:"#", linkedin:"#", portfolio:"#", photo:"https://placehold.co/200x200/050505/FF3B3B?text=AGT-005" },
  { roll_number:"006", name:"Meher Chawla", department:"Design", position:"D-Class Recruit", language:"Figma / CSS", github:"#", linkedin:"#", portfolio:"#", photo:"https://placehold.co/200x200/050505/00FF88?text=AGT-006" },
  { roll_number:"007", name:"Yashwanth Reddy", department:"App Development", position:"A-Class Elite Agent", language:"Kotlin", github:"#", linkedin:"#", portfolio:"#", photo:"https://placehold.co/200x200/050505/00D9FF?text=AGT-007" },
  { roll_number:"008", name:"Ishita Bose", department:"Core Committee", position:"S-Class Cyber Phantom", language:"Go", github:"#", linkedin:"#", portfolio:"#", photo:"https://placehold.co/200x200/050505/FF3B3B?text=AGT-008" }
];

const leaderboard = [
  {name:"Devraj Sen",nickname:"ZeroDay",division:"Cyber Security",threat_class:"Ω-Class Command Elite",xp:24800,missions:81},
  {name:"Ishita Bose",nickname:"SilentStack",division:"Core Committee",threat_class:"S-Class Cyber Phantom",xp:19870,missions:55},
  {name:"Rehan Iqbal",nickname:"NullByte",division:"Cyber Security",threat_class:"S-Class Cyber Phantom",xp:18420,missions:47},
  {name:"Ananya Rao",nickname:"ShadowRoot",division:"Competitive Programming",threat_class:"A-Class Elite Agent",xp:15310,missions:63},
  {name:"Yashwanth Reddy",nickname:"QuantumHex",division:"App Development",threat_class:"A-Class Elite Agent",xp:13040,missions:38},
  {name:"Kiran Vellanki",nickname:"GhostPacket",division:"Web Development",threat_class:"B-Class Specialist",xp:9210,missions:22},
  {name:"Sneha Patil",nickname:"CipherFox",division:"Artificial Intelligence",threat_class:"C-Class Operator",xp:4120,missions:9},
  {name:"Meher Chawla",nickname:"Echo404",division:"Design",threat_class:"D-Class Recruit",xp:980,missions:3}
];

const gallery = [
  ["Events 01","Events","https://placehold.co/500x350/050505/00FF88?text=Events+01"],
  ["Events 02","Events","https://placehold.co/500x650/050505/00D9FF?text=Events+02"],
  ["Meetup 01","Meetup","https://placehold.co/500x400/050505/FF3B3B?text=Meetup+01"],
  ["Events 03","Events","https://placehold.co/500x550/050505/00FF88?text=Events+03"],
  ["Events 04","Events","https://placehold.co/500x350/050505/00D9FF?text=Events+04"],
  ["Meetup 02","Meetup","https://placehold.co/500x600/050505/FF3B3B?text=Meetup+02"],
  ["Events 05","Events","https://placehold.co/500x400/050505/00FF88?text=Events+05"],
  ["Events 06","Events","https://placehold.co/500x500/050505/00D9FF?text=Events+06"]
];

const posters = [{ title:"Inauguration", img:"https://placehold.co/500x650/050505/00FF88?text=Inauguration+Poster", download_url:"" }];
const alerts = [
  { type:"DEADLINE", text:"Registrations for MSN-014 close in 14 days.", priority:"NORMAL" },
  { type:"WORKSHOP", text:"New workshop scheduled: Intro to Web Exploitation.", priority:"NORMAL" },
  { type:"HACKATHON", text:"Ghost Protocol venue confirmed — CSE Seminar Hall.", priority:"HIGH" },
  { type:"UPDATE", text:"Leaderboard recalculated after CP Dojo round 3.", priority:"NORMAL" },
  { type:"SYSTEM", text:"Agent database sync complete. 8 active profiles.", priority:"NORMAL" },
];
const defaultEvent = {
  code:"CO-001", title:"Inauguration Event",
  poster:"https://placehold.co/500x650/050505/00FF88?text=CO-001",
  description:"The official inauguration marking the launch of our club, bringing together members to celebrate the beginning of a new journey in technology, innovation, and collaboration.",
  venue:"1009 Seminar Hall", deadline:"2026-09-11T23:59:00", status:"OPEN", register_url:"https://forms.gle/example1"
};

export async function seedDefaultContent() {
  const { data: marker, error } = await supabase.from("events").select("id").eq("code", defaultEvent.code).maybeSingle();
  if (error) throw error;

  for (const item of alerts) {
    const { data: existing } = await supabase.from("alerts").select("id").eq("type", item.type).eq("text", item.text).maybeSingle();
    if (existing) await supabase.from("alerts").update(item).eq("id", existing.id);
    else await supabase.from("alerts").insert(item);
  }

  if (marker) {
    console.log("Default content already initialized.");
    return;
  }

  await supabase.from("events").insert(defaultEvent);
  for (const item of leaderboard) {
    const { data: existing } = await supabase.from("leaderboard").select("id").eq("name", item.name).eq("nickname", item.nickname).maybeSingle();
    if (existing) await supabase.from("leaderboard").update(item).eq("id", existing.id);
    else await supabase.from("leaderboard").insert(item);
  }
  for (const item of agents) {
    const { data: existing } = await supabase.from("agents").select("id").eq("roll_number", item.roll_number).maybeSingle();
    if (existing) await supabase.from("agents").update(item).eq("id", existing.id);
    else await supabase.from("agents").insert(item);
  }
  for (const [title,category,img] of gallery) {
    const payload={title,category,img};
    const { data: existing } = await supabase.from("gallery").select("id").eq("title", title).eq("category", category).maybeSingle();
    if (existing) await supabase.from("gallery").update(payload).eq("id", existing.id);
    else await supabase.from("gallery").insert(payload);
  }
  for (const item of posters) {
    const { data: existing } = await supabase.from("posters").select("id").eq("title", item.title).maybeSingle();
    if (existing) await supabase.from("posters").update(item).eq("id", existing.id);
    else await supabase.from("posters").insert(item);
    const { data: media } = await supabase.from("media").select("id").eq("url", item.img).maybeSingle();
    if (media) await supabase.from("media").update({title:item.title,kind:"poster"}).eq("id", media.id);
    else await supabase.from("media").insert({title:item.title,url:item.img,kind:"poster"});
  }
  const { data: eventMedia } = await supabase.from("media").select("id").eq("url", defaultEvent.poster).maybeSingle();
  if (!eventMedia) await supabase.from("media").insert({title:"Inauguration Event",url:defaultEvent.poster,kind:"poster"});

  const contact = {
    faculty_coordinator:"Sai Kalyan, Rupa Santoshi, Sashivanth — Dept. of CSD",
    hod:"Shanthi Makka — Dept. of CSD",
    email:"VCE", facebook:"", linkedin:"", instagram:"https://www.instagram.com/codex_vce",
    discord:"", map_url:"https://www.google.com/maps?q=Vardhaman%20College%20of%20Engineering&output=embed"
  };
  const { data: existingContact } = await supabase.from("contact").select("id").limit(1).maybeSingle();
  if (existingContact) await supabase.from("contact").update(contact).eq("id", existingContact.id);
  else await supabase.from("contact").insert(contact);

  const stats = {active_agents:18,community_members:540,projects_completed:76,workshops_conducted:34,hackathons_organised:12};
  const { data: existingStats } = await supabase.from("stats").select("id").limit(1).maybeSingle();
  if (existingStats) await supabase.from("stats").update(stats).eq("id", existingStats.id);
  else await supabase.from("stats").insert(stats);

  console.log("Default CodeOPS content initialized.");
}

if (process.argv[1]?.endsWith("seedContent.js")) {
  seedDefaultContent().catch((error) => { console.error(error); process.exitCode = 1; });
}
