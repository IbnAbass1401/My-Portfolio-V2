import { Component, lazy, Suspense, useCallback, useEffect, useState } from "react";
import EarthFallback from "./EarthFallback";

// the whole 3D code (three.js and friends) is a separate file, fetched only when needed
const EarthCanvas = lazy(() => import("./EarthCanvas"));

// phones and tablets, including iPads that pretend to be a Mac
function isPhoneOrTablet() {
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile|Silk|Tablet/i.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

// returns null when 3D is allowed, otherwise the reason it is switched off
function whyNo3D() {
  if (typeof window === "undefined") return "no window";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "reduce motion is ON";
  if (isPhoneOrTablet()) return "phone or tablet";
  if (window.innerWidth < 768) return `screen too narrow (${window.innerWidth}px, needs 768+)`;
  if (navigator.connection?.saveData) return "data saver is ON";
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
    return `weak device (${navigator.hardwareConcurrency} CPU cores)`;
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) return "WebGL is not available";
  } catch {
    return "WebGL check failed";
  }
  return null;
}

// if the 3D code or a texture fails to load, stay on the orb instead of breaking the page
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error("[globe] 3D failed, keeping the orb:", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroGlobe() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => {
    if (import.meta.env.DEV) console.info("[globe] textures loaded, showing the globe");
    setReady(true);
  }, []);

  // wait until the browser is idle, so the first paint is never slowed down
  useEffect(() => {
    const reason = whyNo3D();
    if (reason) {
      if (import.meta.env.DEV) console.info(`[globe] 3D is off: ${reason}`);
      return;
    }
    const start = () => {
      if (import.meta.env.DEV) console.info("[globe] starting 3D");
      setEnabled(true);
    };
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
          className={`pointer-events-none absolute inset-[-8%] transition-opacity duration-1000 ${
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