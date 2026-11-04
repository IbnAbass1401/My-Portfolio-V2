import { motion, MotionConfig } from "framer-motion";
import { about } from "../constants";
import SectionHeading from "./SectionHeading";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

export default function About() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="about" className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />

          <div className="mt-10 max-w-3xl space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {about.paragraphs.map((p, i) => (
              <motion.p key={i} {...fadeUp(i * 0.1)}>
                {p}
              </motion.p>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {about.stats.map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp(i * 0.12)}
                className="group rounded-2xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-glow/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]"
              >
                <p className="bg-linear-to-r from-glow to-primary bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-muted transition-colors group-hover:text-ink">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}