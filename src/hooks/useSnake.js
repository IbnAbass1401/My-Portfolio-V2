import { useEffect, useRef, useState } from "react";
import { CELL, buildGrid, collectWalls, measureDoc } from "../lib/snake";

// 10A check: also draws the exact cells the snake will treat as walls (faint squares).
// Set to false once the walls look right.
const SHOW_CELLS = true;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const frames = (n) =>
  new Promise((res) => {
    const step = () => (n-- <= 0 ? res() : requestAnimationFrame(step));
    step();
  });

export default function useSnake({ onExit }) {
  const canvasRef = useRef(null);
  const exitRef = useRef(onExit);
  const [status, setStatus] = useState("loading"); // loading | ready
  const [info, setInfo] = useState(null);

  useEffect(() => {
    exitRef.current = onExit;
  }, [onExit]);

  // page mode: lock scrolling, block the page behind, jump to the top, undo all of it on exit
  useEffect(() => {
    const html = document.documentElement;
    const app = document.getElementById("top");
    const prevY = window.scrollY;
    html.classList.add("game-mode");
    app?.setAttribute("inert", "");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => {
      app?.removeAttribute("inert");
      html.classList.remove("game-mode");
      window.scrollTo({ top: prevY, left: 0, behavior: "instant" });
    };
  }, []);

  // measure the page, then draw the walls
  useEffect(() => {
    let raf = 0;
    let timer = 0;
    let dead = false;
    let ro;
    const world = { cols: 0, rows: 0, walls: null, boxes: [], lines: [] };

    const measure = () => {
      const { width, height } = measureDoc();
      const { boxes, lines } = collectWalls();
      Object.assign(world, buildGrid([...boxes, ...lines], width, height), { boxes, lines });
      setInfo({ cols: world.cols, rows: world.rows, boxes: boxes.length, lines: lines.length });
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 250);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = document.documentElement.clientWidth;
        const h = window.innerHeight;
        const pw = Math.round(w * dpr);
        const ph = Math.round(h * dpr);
        if (canvas.width !== pw || canvas.height !== ph) {
          canvas.width = pw;
          canvas.height = ph;
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
        }
        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        // dim the page
        ctx.fillStyle = "rgba(5, 10, 24, 0.55)";
        ctx.fillRect(0, 0, w, h);

        // from here on, draw in page coordinates
        const sy = window.scrollY;
        ctx.translate(0, -sy);

        if (SHOW_CELLS && world.walls) {
          ctx.fillStyle = "rgba(56, 189, 248, 0.12)";
          const r0 = Math.max(0, Math.floor(sy / CELL));
          const r1 = Math.min(world.rows - 1, Math.ceil((sy + h) / CELL));
          for (let r = r0; r <= r1; r++) {
            for (let c = 0; c < world.cols; c++) {
              if (world.walls[r * world.cols + c]) ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
            }
          }
        }

        // faint outlines: text lines, then elements
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        for (const [x, y, rw, rh] of world.lines) {
          if (y + rh >= sy && y <= sy + h) ctx.strokeRect(x + 0.5, y + 0.5, rw - 1, rh - 1);
        }
        ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
        ctx.fillStyle = "rgba(37, 99, 235, 0.07)";
        for (const [x, y, rw, rh] of world.boxes) {
          if (y + rh >= sy && y <= sy + h) {
            ctx.fillRect(x, y, rw, rh);
            ctx.strokeRect(x + 0.5, y + 0.5, rw - 1, rh - 1);
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    // 10A inspect mode: keys scroll the page so you can check every wall (replaced by the snake in 10B)
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        exitRef.current?.();
        return;
      }
      const vh = window.innerHeight;
      const step =
        e.key === "ArrowDown" ? 80
        : e.key === "ArrowUp" ? -80
        : e.key === "PageDown" ? vh * 0.8
        : e.key === "PageUp" ? -vh * 0.8
        : e.key === "Home" ? -1e6
        : e.key === "End" ? 1e6
        : 0;
      if (step) {
        e.preventDefault();
        window.scrollBy({ top: step, behavior: "instant" });
      }
    };

    // 10A inspect mode on touch screens: drag to scroll
    let lastY = null;
    const onTouchStart = (e) => {
      lastY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      const y = e.touches[0]?.clientY;
      if (lastY == null || y == null) return;
      window.scrollBy({ top: lastY - y, behavior: "instant" });
      lastY = y;
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", schedule);

    (async () => {
      // wait until every section has really loaded (not the empty placeholders)
      for (let i = 0; i < 40 && document.querySelector('section[aria-hidden="true"]'); i++) {
        await sleep(100);
      }
      await frames(2);
      if (dead) return;
      measure();
      setStatus("ready");
      draw();
      ro = new ResizeObserver(schedule);
      ro.observe(document.body);
    })();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro?.disconnect();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { canvasRef, status, info };
}