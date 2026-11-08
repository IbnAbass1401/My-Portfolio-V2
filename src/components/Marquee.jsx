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
  // stops while a mouse hovers it or a finger is held on it, moves again when released
  const [held, setHeld] = useState(false);
  const hold = () => setHeld(true);
  const release = () => setHeld(false);

  return (
    <section
      aria-label="Technologies I work with"
      className="relative border-y border-line/60 bg-surface/30 py-5"
    >
      <div
        className="touch-pan-y select-none overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && hold()}
        onPointerDown={hold}
        onPointerUp={(e) => e.pointerType !== "mouse" && release()}
        onPointerCancel={release}
        onPointerLeave={release}
      >
        <div
          className={`flex w-max animate-marquee motion-reduce:w-auto motion-reduce:animate-none motion-reduce:justify-center ${
            held ? "[animation-play-state:paused]" : ""
          }`}
        >
          <Group />
          <Group hidden />
        </div>
      </div>
    </section>
  );
}