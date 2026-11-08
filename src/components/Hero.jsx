import { useRef } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import useTyping from "../hooks/useTyping";
import { hero } from "../constants";
import HeroGlobe from "./canvas/HeroGlobe";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const btn =
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition duration-300";

export default function Hero() {
  const reduce = useReducedMotion();
  const typed = useTyping(hero.roles, { enabled: !reduce });

  // the globe drifts down and fades a little while you scroll past the hero
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="hero"
        className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden"
      >
        {/* glow background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-0 size-105 rounded-full bg-primary/25 blur-[120px]" />
          <div className="absolute -right-24 bottom-0 size-95 rounded-full bg-glow/15 blur-[120px]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 md:py-16">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center md:text-left"
          >
            <motion.div
              variants={item}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs text-muted backdrop-blur"
            >
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
              {hero.availability}
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
            >
              {hero.greeting}{" "}
              <span className="bg-linear-to-r from-glow to-primary bg-clip-text text-transparent">
                {hero.name}
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 min-h-[1.6em] text-xl font-semibold text-glow sm:text-2xl md:text-3xl"
            >
              <span className="sr-only">{hero.roles.join(", ")}</span>
              <span aria-hidden="true">
                {typed}
                <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-1 animate-pulse bg-glow" />
              </span>
            </motion.p>

            <motion.p
              variants={item}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted md:mx-0"
            >
              {hero.pitch}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
            >
              <a
                href="#work"
                className={`${btn} bg-primary text-white hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(56,189,248,0.55)]`}
              >
                View my work
              </a>
              <a
                href="#contact"
                className={`${btn} border border-glow/50 text-glow hover:-translate-y-0.5 hover:bg-glow/10 hover:shadow-[0_0_24px_rgba(56,189,248,0.3)]`}
              >
                Hire me
              </a>
              <a
                href={hero.cvPath}
                download
                className={`${btn} border border-line text-ink hover:-translate-y-0.5 hover:border-glow/50 hover:bg-surface`}
              >
                Download CV ↓
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          >
            <motion.div style={reduce ? undefined : { y: orbY, opacity: orbOpacity }}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeroGlobe />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}