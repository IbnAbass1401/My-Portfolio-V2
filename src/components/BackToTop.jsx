import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  // appears once you have scrolled down a little
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-50 flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_24px_rgba(56,189,248,0.45)] transition duration-300 hover:scale-110 hover:bg-glow hover:text-bg hover:shadow-[0_0_32px_rgba(56,189,248,0.7)] ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        className="size-5"
      >
        <path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}