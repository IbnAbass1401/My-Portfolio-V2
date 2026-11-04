import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, center = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={center ? "text-center" : ""}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-glow">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
        {title}
      </h2>
      <div
        className={`mt-4 h-1 w-16 rounded-full bg-linear-to-r from-glow to-primary shadow-[0_0_14px_rgba(56,189,248,0.6)] ${
          center ? "mx-auto" : ""
        }`}
      />
    </motion.div>
  );
}