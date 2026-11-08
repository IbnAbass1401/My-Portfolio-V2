import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Earth from "./Earth";

export default function EarthCanvas({ onReady }) {
  return (
    <Canvas
      flat /* no tone mapping: the texture colours stay true */
      dpr={[1, 1.75]}
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