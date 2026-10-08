import { motion } from "framer-motion";

export default function HexPanel({ icon: Icon, title, desc, accent = "#00FF88" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center text-center gap-4 p-6 w-56"
    >
      <div
        className="hex w-24 h-24 flex items-center justify-center glass"
        style={{ boxShadow: `0 0 22px ${accent}55` }}
      >
        <Icon size={34} color={accent} />
      </div>
      <h3 className="font-display text-sm tracking-widest uppercase" style={{ color: accent }}>
        {title}
      </h3>
      <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
    </motion.div>
  );
}