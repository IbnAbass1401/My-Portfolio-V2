import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import EarthFallback from "./EarthFallback";

// the whole 3D code (three.js and friends) is a separate file, fetched only when needed
const EarthCanvas = lazy(() => import("./EarthCanvas"));

// add ?globe=debug to the address to see the status on screen
// add ?globe=force to skip the weak-device rules (for testing only)
const mode =
  typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("globe") : null;
const DEBUG = mode === "debug" || mode === "force";
const FORCE = mode === "force";

function isPhoneOrTablet() {
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile|Silk|Tablet/i.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1; // iPad posing as a Mac
}

function deviceInfo() {
  const c = navigator.connection;
  return `${navigator.hardwareConcurrency ?? "?"} cores, ${navigator.deviceMemory ?? "?"} GB, net ${
    c?.effectiveType ?? "?"
  }${c?.saveData ? ", saveData" : ""}`;
}

// decides whether this device gets the 3D globe, and how
function check3D() {
  if (typeof window === "undefined") return { reason: "no window" };

  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  if (!webgl) return { reason: "WebGL is not available" };

  const lite = isPhoneOrTablet() || window.innerWidth < 768;
  if (FORCE) return { reason: null, lite };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return { reason: "reduce motion is ON" };

  const conn = navigator.connection;
  if (conn?.saveData) return { reason: "data saver is ON" };
  if (conn?.effectiveType && /2g$/.test(conn.effectiveType))
    return { reason: `very slow connection (${conn.effectiveType})` };

  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
    return { reason: `weak device (${navigator.hardwareConcurrency} CPU cores)` };
  // 2 GB phones are allowed; only 1 GB or less keeps the orb
  if (navigator.deviceMemory && navigator.deviceMemory <= 1)
    return { reason: `low memory (${navigator.deviceMemory} GB)` };

  return { reason: null, lite };
}

// if the 3D code or a texture fails to load, stay on the orb instead of breaking the page
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error("[globe] 3D failed, keeping the orb:", error);
    this.props.onError?.(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroGlobe() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [lite, setLite] = useState(false);
  const [active, setActive] = useState(true);
  const [note, setNote] = useState("checking…");
  const box = useRef(null);

  const say = useCallback((msg) => {
    if (import.meta.env.DEV) console.info(`[globe] ${msg}`);
    if (DEBUG) setNote(msg);
  }, []);

  const onReady = useCallback(() => {
    say("loaded: showing the globe");
    setReady(true);
  }, [say]);

  const onError = useCallback(
    (error) => say(`FAILED: ${error?.message || String(error)}`),
    [say]
  );

  // decide, then start when the page is calm
  useEffect(() => {
    const { reason, lite: isLite } = check3D();
    if (reason) {
      say(`off: ${reason}`);
      return;
    }
    setLite(isLite);
    say(isLite ? "allowed (lite). waiting for first scroll, tap, or 6s" : "allowed. starting when idle");

    let started = false;
    const cleanups = [];
    const start = () => {
      if (started) return;
      started = true;
      say(`downloading 3D${isLite ? " (lite)" : ""}…`);
      setEnabled(true);
    };

    if (isLite) {
      // phones: wait for the first scroll or tap, or 6 seconds
      const events = ["scroll", "touchstart", "pointerdown", "keydown"];
      events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
      const t = window.setTimeout(start, 6000);
      cleanups.push(() => {
        events.forEach((e) => window.removeEventListener(e, start));
        window.clearTimeout(t);
      });
    } else if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      cleanups.push(() => window.cancelIdleCallback(id));
    } else {
      const id = window.setTimeout(start, 1500);
      cleanups.push(() => window.clearTimeout(id));
    }
    return () => cleanups.forEach((fn) => fn());
  }, [say]);

  // pause the 3D while the hero is off screen
  useEffect(() => {
    if (!enabled || !box.current || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(box.current);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <div
      ref={box}
      className="relative mx-auto aspect-square w-full max-w-65 sm:max-w-85 md:max-w-110"
    >
      {/* the orb: shown first, fades out when the globe is ready */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <EarthFallback />
      </div>

      {enabled && (
        <div
          aria-hidden="true"
          className={`absolute inset-[-8%] transition-opacity duration-1000 ${
            ready ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Boundary onError={onError}>
            <Suspense fallback={null}>
              <EarthCanvas onReady={onReady} lite={lite} active={active} />
            </Suspense>
          </Boundary>
        </div>
      )}

      {/* only visible with ?globe=debug or ?globe=force */}
      {DEBUG && (
        <p className="absolute inset-x-0 -bottom-14 z-10 rounded-lg bg-black/80 px-3 py-2 text-center text-[11px] leading-snug text-glow">
          {note}
          <br />
          <span className="text-muted">{deviceInfo()}</span>
        </p>
      )}
    </div>
  );
}