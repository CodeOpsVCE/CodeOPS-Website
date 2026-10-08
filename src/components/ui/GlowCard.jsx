import { motion } from "framer-motion";

export default function GlowCard({ children, accent = "neon", className = "", as: Tag = "div", ...rest }) {
  const accentColor = accent === "cyan" ? "#00D9FF" : accent === "alert" ? "#FF3B3B" : "#00FF88";
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 0 26px ${accentColor}55, inset 0 0 30px ${accentColor}0d` }}
      transition={{ duration: 0.25 }}
      className={`glass rounded-xl p-6 relative overflow-hidden ${className}`}
      style={{ borderColor: `${accentColor}33` }}
      {...rest}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
      {children}
    </motion.div>
  );
}