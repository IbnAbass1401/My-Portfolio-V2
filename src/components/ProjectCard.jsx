import { useState } from "react";
import { motion } from "framer-motion";
import CaseStudy from "./CaseStudy";

const linkBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-300";

export default function ProjectCard({ project, index }) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group grid overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:border-glow/50 hover:shadow-[0_0_40px_rgba(56,189,248,0.2)] md:grid-cols-2 md:items-center lg:grid-cols-[1.15fr_1fr]"
    >
      {/* screenshot: same box for every project, the full image always fits inside */}
      <div className="relative flex aspect-16/10 w-full items-center justify-center overflow-hidden border-b border-line bg-linear-to-br from-bg via-surface to-bg p-3 sm:p-4 md:border-b-0 md:border-r">
        {failed ? (
          <div
            aria-hidden="true"
            className="flex size-full items-center justify-center rounded-lg bg-linear-to-br from-primary/30 via-surface to-glow/20 text-3xl font-extrabold tracking-wide text-ink/80"
          >
            {project.title}
          </div>
        ) : (
          <img
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            width="1280"
            height="800"
            loading="lazy"
            onError={() => setFailed(true)}
            className="max-h-full max-w-full rounded-lg object-contain shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          />
        )}
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-glow">
          Project {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold transition-colors group-hover:text-glow">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-muted"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live site (opens in a new tab)`}
            className={`${linkBtn} bg-primary text-white hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(56,189,248,0.5)]`}
          >
            Live ↗
          </a>
          <a
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source code on GitHub (opens in a new tab)`}
            className={`${linkBtn} border border-line text-ink hover:-translate-y-0.5 hover:border-glow/50 hover:bg-bg`}
          >
            Code ↗
          </a>
        </div>

        {project.note && (
          <p className="mt-3 text-xs leading-relaxed text-muted/80">{project.note}</p>
        )}

        <CaseStudy data={project.caseStudy} />
      </div>
    </motion.li>
  );
}