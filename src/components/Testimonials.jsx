import { motion, MotionConfig } from "framer-motion";
import { testimonials, isTestimonialReady } from "../constants";
import SectionHeading from "./SectionHeading";

function Stars({ rating }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="mt-4 flex gap-1 text-lg transition-transform duration-300 group-hover:scale-110"
      style={{ transformOrigin: "left" }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden="true"
          className={n <= rating ? "text-star drop-shadow-[0_0_8px_rgba(251,191,36,0.55)]" : "text-line"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const hint =
  "rounded-lg border border-dashed border-star/60 bg-star/5 px-3 py-2 text-sm text-star";

export default function Testimonials() {
  const dev = import.meta.env.DEV;
  const items = dev ? testimonials.items : testimonials.items.filter(isTestimonialReady);
  if (!items.length) return null; 

  return (
    <MotionConfig reducedMotion="user">
      <section id="reviews" className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={testimonials.eyebrow} title={testimonials.title} />

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => {
              const ready = isTestimonialReady(t);
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: (i % 3) * 0.12 }}
                  className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1.5 hover:border-glow/50 hover:shadow-[0_0_34px_rgba(56,189,248,0.2)]"
                >
                  <span aria-hidden="true" className="text-5xl font-extrabold leading-none text-glow/40">
                    “
                  </span>

                  {t.rating ? (
                    <Stars rating={t.rating} />
                  ) : (
                    <p className={`${hint} mt-4`}>✎ Add the star rating (1–5) this person gave</p>
                  )}

                  {t.quote ? (
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted sm:text-base">
                      {t.quote}
                    </blockquote>
                  ) : (
                    <p className={`${hint} mt-4 flex-1`}>✎ Paste the exact message from this person</p>
                  )}

                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                    <div
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-glow to-primary font-bold text-white"
                    >
                      {t.name ? t.name[0] : "?"}
                    </div>
                    <div className="min-w-0">
                      {ready || (t.name && t.role) ? (
                        <>
                          <p className="truncate font-semibold">{t.name}</p>
                          <p className="truncate text-xs text-muted">{t.role}</p>
                        </>
                      ) : (
                        <p className="text-xs text-star">✎ Add name and role</p>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}