import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import GlowCard from "../ui/GlowCard";
import Reveal from "../ui/Reveal";
import { posters as fallback } from "../../data/misc";
import { api, resolveAssetUrl } from "../../lib/api";

export default function Posters(){
 const [posters,setPosters]=useState(fallback);
 useEffect(()=>{api.posters.list().then(setPosters).catch(()=>{});},[]);
 return <section id="posters" className="relative py-24 px-4 md:px-8"><div className="max-w-6xl mx-auto"><Reveal><SectionHeading title="Posters" accent="#00D9FF"/></Reveal><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{posters.map((p,i)=><Reveal key={p._id||p.id||i} delay={i*0.1}><GlowCard accent="cyan"><img src={resolveAssetUrl(p.img)} alt={p.title} className="rounded-md mb-4 w-full object-cover" loading="lazy"/><h3 className="font-display text-sm text-white mb-4">{p.title}</h3>{p.downloadUrl&&<a href={resolveAssetUrl(p.downloadUrl)} download className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-[#00D9FF] text-[#00D9FF] font-mono text-xs uppercase tracking-wider hover:bg-[#00D9FF]/10 transition"><Download size={14}/>Download</a>}</GlowCard></Reveal>)}</div>{!posters.length&&<div className="text-center text-white/30 text-sm mt-8">No posters published yet.</div>}</div></section>;
}
