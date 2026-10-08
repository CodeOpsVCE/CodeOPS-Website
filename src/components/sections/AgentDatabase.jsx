import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Code2, Briefcase, Globe } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import GlowCard from "../ui/GlowCard";
import Reveal from "../ui/Reveal";
import { agents as fallback } from "../../data/agents";
import { api, resolveAssetUrl } from "../../lib/api";

function AgentAvatar({ agent, className = "w-16 h-16" }) {
  const position = agent.position || "AGENT";
  return agent.photo ? (
    <img src={resolveAssetUrl(agent.photo)} alt={agent.name} className={className + " rounded-full border-2 object-cover"} />
  ) : (
    <div className={className + " rounded-full border-2 border-[#00FF88]/40 bg-[#00FF88]/5 flex items-center justify-center text-center px-2"}>
      <span className="font-mono text-[9px] leading-tight text-[#00FF88] uppercase">{position}</span>
    </div>
  );
}

function AgentModal({ agent, onClose }) {
  if (!agent) return null;
  return <AnimatePresence><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}><motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:20}} onClick={e=>e.stopPropagation()} className="glass rounded-2xl max-w-lg w-full p-6 relative box-glow-neon max-h-[85vh] overflow-y-auto"><button onClick={onClose} aria-label="Close dossier" className="absolute top-4 right-4 text-white/50 hover:text-[#00FF88]"><X size={20}/></button><div className="flex items-center gap-4 mb-6"><AgentAvatar agent={agent} className="w-20 h-20" /><div><div className="font-mono text-[10px] text-white/40">ROLL NO: {agent.rollNumber}</div><h3 className="font-display text-xl text-[#00FF88] text-glow">{agent.name}</h3></div></div><div className="grid grid-cols-2 gap-3 text-xs mb-6"><Field label="Department" value={agent.department}/><Field label="Position" value={agent.position} className="col-span-2"/></div><div className="flex gap-4 pt-4 border-t border-white/10 text-white/50">{agent.github&&agent.github!=="#"&&<a href={agent.github} target="_blank" rel="noreferrer" className="hover:text-[#00FF88] flex items-center gap-1.5 text-xs"><Code2 size={14}/>GitHub</a>}{agent.linkedin&&agent.linkedin!=="#"&&<a href={agent.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#00FF88] flex items-center gap-1.5 text-xs"><Briefcase size={14}/>LinkedIn</a>}{agent.portfolio&&agent.portfolio!=="#"&&<a href={agent.portfolio} target="_blank" rel="noreferrer" className="hover:text-[#00FF88] flex items-center gap-1.5 text-xs"><Globe size={14}/>Portfolio</a>}</div></motion.div></motion.div></AnimatePresence>;
}
function Field({label,value,className=""}){return <div className={className}><div className="text-white/35 uppercase tracking-widest text-[10px] mb-0.5">{label}</div><div className="text-white/85">{value||"—"}</div></div>;}
export default function AgentDatabase(){
 const [agents,setAgents]=useState(fallback); const [selected,setSelected]=useState(null);
 useEffect(()=>{api.agents.list().then(setAgents).catch(()=>{});},[]);
 const positionRank=(value)=>{const p=String(value||"").trim().toLowerCase();if(p==="president")return 0;if(["vice president","vice-president","vide-president"].includes(p))return 1;if(["treasurer","treasurers"].includes(p))return 2;if(/^wing admin\s+[a-z]\d+$/i.test(p))return 3;if(["website handler","website handlers"].includes(p))return 4;if(["content creator","content creators"].includes(p))return 5;if(["social media handler","social media handlers"].includes(p))return 6;if(["photographer","photographers"].includes(p))return 7;return 99;};
 const defaultSort=(a,b)=>{const ar=positionRank(a.position),br=positionRank(b.position);if(ar!==br)return ar-br;if(ar===3){const wing=(value)=>{const m=String(value||"").match(/^wing admin\s+([a-z])(\d+)$/i);return m?m[1].toUpperCase()+String(m[2]).padStart(4,"0"):"";};const aw=wing(a.position),bw=wing(b.position);if(aw!==bw)return aw.localeCompare(bw,undefined,{numeric:true});}return String(a.rollNumber||"").localeCompare(String(b.rollNumber||""),undefined,{numeric:true,sensitivity:"base"});};
 const hasCustomOrder=agents.some((agent)=>Number.isFinite(agent.displayOrder));
 const orderedAgents=[...agents].sort((a,b)=>{if(hasCustomOrder){const ao=Number.isFinite(a.displayOrder)?a.displayOrder:Number.MAX_SAFE_INTEGER;const bo=Number.isFinite(b.displayOrder)?b.displayOrder:Number.MAX_SAFE_INTEGER;if(ao!==bo)return ao-bo;}return defaultSort(a,b);});
 return <section id="agents" className="relative py-24 px-4 md:px-8 bg-[#070707]"><div className="max-w-7xl mx-auto"><Reveal><SectionHeading title="Agent Database"/></Reveal><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{orderedAgents.map((agent,i)=><Reveal key={agent._id||agent.id||i} delay={i*0.05}><GlowCard className="text-center"><div className="mx-auto mb-3"><AgentAvatar agent={agent}/></div><div className="font-mono text-[10px] text-white/40">ROLL NO: {agent.rollNumber}</div><h3 className="font-display text-sm text-[#00FF88] mt-1">{agent.name}</h3><div className="text-[10px] mt-2 text-white/40">{agent.department}</div><button onClick={()=>setSelected(agent)} className="mt-4 w-full py-2 rounded-md border border-[#00FF88]/40 text-[#00FF88] text-[11px] font-mono uppercase tracking-wider hover:bg-[#00FF88]/10 transition">View Dossier</button></GlowCard></Reveal>)}</div></div><AgentModal agent={selected} onClose={()=>setSelected(null)}/></section>;
}