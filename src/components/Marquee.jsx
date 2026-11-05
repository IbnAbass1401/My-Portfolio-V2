import { useState } from "react";
import { techStack } from "../constants";

function Group({ hidden = false }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 gap-3 pr-3 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0 ${
        hidden ? "motion-reduce:hidden" : ""
      }`}
    >
      {techStack.map((t) => (
        <li
          key={t}
          className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface/70 px-5 text-sm text-muted transition duration-300 hover:border-glow/50 hover:text-glow hover:shadow-[0_0_18px_rgba(56,189,248,0.25)]"
        >
          <span className="text-glow">◆</span>
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Technologies I work with"
      className="relative border-y border-line/60 bg-surface/30 py-5"
    >
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className={`flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none motion-reduce:justify-center ${
            paused ? "[animation-play-state:paused]" : ""
          }`}
        >
          <Group />
          <Group hidden />
        </div>
      </div>

      {/* pause / play: for touch and keyboard users */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Play scrolling technologies" : "Pause scrolling technologies"}
        className="absolute right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/90 text-ink backdrop-blur transition hover:border-glow/60 hover:text-glow motion-reduce:hidden"
      >
        {paused ? (
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path d="M6 4.5v11l9-5.5-9-5.5Z" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <rect x="5" y="4" width="3.5" height="12" rx="1" />
            <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
          </svg>
        )}
      </button>
    </section>
  );
}