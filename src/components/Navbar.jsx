import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, siteConfig } from "../constants";

const underline =
  "relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:rounded after:bg-glow after:transition-all after:duration-300 hover:after:w-full";

// syncKey changes when the real sections replace the placeholders, so the highlight keeps working
export default function Navbar({ syncKey = 0 }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const menuBtn = useRef(null);

  // solid background after scrolling; clear the active link at the very top
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (window.scrollY < 200) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // highlight the link of the section in the middle of the screen
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [syncKey]);

  // mobile menu: lock page scroll, Esc closes and returns focus to the button, close if screen grows
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-80 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
          scrolled || open
            ? "border-line bg-bg/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        >
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center bg-linear-to-r from-glow to-primary bg-clip-text text-xl font-extrabold tracking-[0.2em] text-transparent transition hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
          >
            {siteConfig.logo}
          </a>

          {/* desktop links */}
          <ul className="hidden items-center gap-7 text-sm md:flex">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`${underline} transition-colors duration-300 hover:text-ink ${
                    active === l.id ? "text-ink after:w-full" : "text-muted"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* mobile menu button */}
          <button
            ref={menuBtn}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="relative size-11 rounded-lg md:hidden"
          >
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 rounded bg-ink transition-all duration-300 ${
                open ? "-translate-y-1/2 rotate-45" : "-translate-y-2.25"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded bg-ink transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 rounded bg-ink transition-all duration-300 ${
                open ? "-translate-y-1/2 -rotate-45" : "translate-y-1.75"
              }`}
            />
          </button>
        </nav>

        {/* mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full border-b border-line bg-bg/95 backdrop-blur-xl md:hidden"
            >
              <ul className="mx-auto max-w-6xl px-5 pb-4 sm:px-8">
                {navLinks.map((l) => (
                  <li key={l.id} className="border-b border-line/60 last:border-0">
                    <a
                      href={`#${l.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === l.id ? "true" : undefined}
                      className={`flex min-h-12 items-center text-lg transition-colors hover:text-glow ${
                        active === l.id ? "text-glow" : "text-muted"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* dim backdrop behind the mobile menu, tap to close */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}