import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Earth from "./Earth";

// lite = phones and tablets: lower sharpness to save battery
// active = false while the hero is off screen: rendering pauses
export default function EarthCanvas({ onReady, lite = false, active = true }) {
  return (
    <Canvas
      flat /* no tone mapping: the colours stay true */
      dpr={lite ? [1, 1.5] : [1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 3.8], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Earth onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}