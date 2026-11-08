import { Component, lazy, Suspense, useCallback, useEffect, useState } from "react";
import EarthFallback from "./EarthFallback";

// the whole 3D code (three.js and friends) is a separate file, fetched only when needed
const EarthCanvas = lazy(() => import("./EarthCanvas"));

function canUse3D() {
  if (typeof window === "undefined") return false;
  const matches = (q) => window.matchMedia(q).matches;
  if (matches("(prefers-reduced-motion: reduce)")) return false;
  if (!matches("(hover: hover) and (pointer: fine)")) return false; // phones and tablets
  if (window.innerWidth < 768) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// if the 3D code or a texture fails to load, stay on the orb instead of breaking the page
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroGlobe() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  // wait until the browser is idle, so the first paint is never slowed down
  useEffect(() => {
    if (!canUse3D()) return;
    const start = () => setEnabled(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-65 sm:max-w-85 md:max-w-110">
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
          className={`pointer-events-none absolute inset-[8%] transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <Boundary>
            <Suspense fallback={null}>
              <EarthCanvas onReady={onReady} />
            </Suspense>
          </Boundary>
        </div>
      )}
    </div>
  );
}