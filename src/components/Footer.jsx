import { siteConfig } from "../constants";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-muted sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p>Built with React, Tailwind CSS and Framer Motion.</p>
        <a
          href="#top"
          className="inline-flex min-h-11 items-center rounded-full px-4 transition hover:text-glow"
        >
          Back to top ↑
        </a>
      </div>
      <p className="mx-auto mt-2 max-w-6xl text-center text-xs text-muted/80 sm:text-left">
        Earth textures:{" "}
        <a
          href="https://www.solarsystemscope.com/textures/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition hover:text-glow"
        >
          Solar System Scope
        </a>{" "}
        (CC BY 4.0).
      </p>
    </footer>
  );
}