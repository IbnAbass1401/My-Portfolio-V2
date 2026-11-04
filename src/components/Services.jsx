import { motion, MotionConfig } from "framer-motion";
import { services } from "../constants";
import SectionHeading from "./SectionHeading";

export default function Services() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="services" className="relative px-5 py-20 sm:px-8 sm:py-28">
        {/* soft glow behind the grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
        />

        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={services.eyebrow} title={services.title} />

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.items.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: "easeOut", delay: (i % 3) * 0.12 }}
                className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1.5 hover:border-glow/50 hover:shadow-[0_0_34px_rgba(56,189,248,0.22)]"
              >
                {/* glow sweep on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-glow/0 blur-3xl transition duration-500 group-hover:bg-glow/20"
                />

                <div
                  aria-hidden="true"
                  className="relative flex size-12 items-center justify-center rounded-xl border border-line bg-bg text-2xl transition duration-300 group-hover:scale-110 group-hover:border-glow/60 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                >
                  {s.icon}
                </div>

                <h3 className="relative mt-5 text-lg font-bold transition-colors group-hover:text-glow">
                  {s.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">
                  {s.text}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}