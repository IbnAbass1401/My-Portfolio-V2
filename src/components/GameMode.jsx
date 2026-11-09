import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useSnake from "../hooks/useSnake";

function Overlay({ onExit }) {
  const { canvasRef, status, info } = useSnake({ onExit });
  const [shown, setShown] = useState(false);
  const exitBtn = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    exitBtn.current?.focus({ preventScroll: true });
    return () => cancelAnimationFrame(id);
  }, []);

  return createPortal(
    <div
      data-game-ui
      role="dialog"
      aria-modal="true"
      aria-label="Snake game"
      className={`fixed inset-0 z-[90] touch-none select-none overscroll-none transition-opacity duration-300 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute left-0 top-0" />

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="rounded-xl border border-line bg-bg/80 px-3 py-2 text-xs text-muted backdrop-blur">
          <p className="font-bold tracking-[0.2em] text-glow">GAME MODE</p>
          <p className="mt-0.5">
            {status === "loading" || !info
              ? "Preparing the page…"
              : `${info.boxes} blocks · ${info.lines} text lines · grid ${info.cols}×${info.rows}`}
          </p>
        </div>
        <button
          ref={exitBtn}
          type="button"
          onClick={onExit}
          className="pointer-events-auto min-h-11 rounded-full border border-glow/60 bg-bg/80 px-5 text-sm font-semibold text-glow backdrop-blur transition hover:bg-glow hover:text-bg"
        >
          Exit
        </button>
      </div>

      {/* hint */}
      <p className="pointer-events-none absolute inset-x-0 bottom-0 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-center text-xs text-muted">
        <span className="rounded-lg bg-bg/80 px-3 py-1.5 backdrop-blur">
          Wall check: scroll with ↑ ↓ PgUp PgDn or drag · Esc exits
        </span>
      </p>
    </div>,
    document.body
  );
}

export default function GameMode() {
  const [open, setOpen] = useState(false);
  const tabRef = useRef(null);

  const exit = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => tabRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <>
      <button
        ref={tabRef}
        type="button"
        data-game-ui
        onClick={() => setOpen(true)}
        aria-label="Start game mode"
        className="animate-gamepulse fixed right-0 top-1/2 z-[60] -translate-y-1/2 rounded-l-xl border border-r-0 border-glow/60 bg-surface/90 px-2.5 py-4 text-[11px] font-bold tracking-[0.3em] text-glow backdrop-blur transition duration-300 [writing-mode:vertical-rl] hover:bg-glow hover:text-bg sm:px-3"
      >
        GAME MODE
      </button>
      {open && <Overlay onExit={exit} />}
    </>
  );
}