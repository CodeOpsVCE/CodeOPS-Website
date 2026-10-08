import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { galleryItems as fallback } from "../../data/misc";
import { api, resolveAssetUrl } from "../../lib/api";

const DEFAULT_CATEGORIES=["All","Events","Meetup"];
export default function Gallery(){
 const [items,setItems]=useState(fallback); const [filter,setFilter]=useState("All"); const [lightboxIdx,setLightboxIdx]=useState(null);
 useEffect(()=>{api.gallery.list().then(setItems).catch(()=>{});},[]);
 const categories=Array.from(new Set([...DEFAULT_CATEGORIES,...items.map(g=>g.category).filter(Boolean)]));
 const filtered=filter==="All"?items:items.filter(g=>g.category===filter);
 const openLightbox=id=>setLightboxIdx(filtered.findIndex(g=>g._id===id||g.id===id));
 const closeLightbox=()=>setLightboxIdx(null); const next=()=>setLightboxIdx(i=>(i+1)%filtered.length); const prev=()=>setLightboxIdx(i=>(i-1+filtered.length)%filtered.length);
 return <section id="gallery" className="relative py-24 px-4 md:px-8 bg-[#070707]"><div className="max-w-7xl mx-auto"><Reveal><SectionHeading title="Gallery"/></Reveal><Reveal delay={0.1}><div className="flex justify-center gap-3 mb-8 flex-wrap">{categories.map(c=><button key={c} onClick={()=>setFilter(c)} className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition ${filter===c?"bg-[#00FF88] text-black border-[#00FF88]":"border-white/20 text-white/60 hover:border-[#00FF88] hover:text-[#00FF88]"}`}>{c}</button>)}</div></Reveal><div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">{filtered.map((g,i)=><button key={g._id||g.id||i} onClick={()=>openLightbox(g._id||g.id)} className="relative block w-full break-inside-avoid rounded-lg overflow-hidden group focus-visible:outline-2"><img src={resolveAssetUrl(g.img)} alt={g.title||g.category} className="w-full object-cover transition group-hover:scale-105 duration-300" loading="lazy"/><div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-end p-3 opacity-0 group-hover:opacity-100"><span className="text-xs font-mono text-[#00FF88] uppercase">{g.category}</span></div></button>)}</div></div><AnimatePresence>{lightboxIdx!==null&&filtered[lightboxIdx]&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}><button onClick={closeLightbox} aria-label="Close" className="absolute top-6 right-6 text-white/70 hover:text-[#00FF88]"><X size={28}/></button><button onClick={e=>{e.stopPropagation();prev();}} aria-label="Previous image" className="absolute left-4 md:left-10 text-white/70 hover:text-[#00FF88]"><ChevronLeft size={32}/></button><motion.img key={filtered[lightboxIdx]._id||filtered[lightboxIdx].id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} src={resolveAssetUrl(filtered[lightboxIdx].img)} alt={filtered[lightboxIdx].title||filtered[lightboxIdx].category} onClick={e=>e.stopPropagation()} className="max-h-[80vh] rounded-lg box-glow-neon"/><button onClick={e=>{e.stopPropagation();next();}} aria-label="Next image" className="absolute right-4 md:right-10 text-white/70 hover:text-[#00FF88]"><ChevronRight size={32}/></button></motion.div>}</AnimatePresence></section>;
}
