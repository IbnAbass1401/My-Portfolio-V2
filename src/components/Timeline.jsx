import { motion, MotionConfig } from "framer-motion";
import { journey } from "../constants";
import SectionHeading from "./SectionHeading";

const rows = [
  { key: "solved", label: "Problem solved" },
  { key: "challenges", label: "Challenges" },
  { key: "learned", label: "Learned" },
];

export default function Timeline() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="journey" className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow={journey.eyebrow} title={journey.title} />

          <ol className="mt-12 space-y-10 border-l-2 border-line pl-8 sm:pl-10">
            {journey.items.map((j, i) => (
              <motion.li
                key={j.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.08 }}
                className="group relative"
              >
                {/* glowing dot on the line */}
                <span
                  aria-hidden="true"
                  className="absolute -left-10 top-7 size-3.5 rounded-full bg-glow shadow-[0_0_16px_var(--color-glow)] transition duration-300 group-hover:scale-125 sm:-left-12"
                />

                <div className="rounded-2xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-glow/50 hover:shadow-[0_0_34px_rgba(56,189,248,0.2)] sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-glow">
                    {j.period}
                  </p>
                  <h3 className="mt-1 text-xl font-bold transition-colors group-hover:text-glow">
                    {j.title}
                  </h3>

                  <dl className="mt-4 grid gap-3">
                    {rows.map((r) => (
                      <div key={r.key}>
                        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted/80">
                          {r.label}
                        </dt>
                        <dd className="mt-0.5 text-sm leading-relaxed text-muted sm:text-base">
                          {j[r.key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}