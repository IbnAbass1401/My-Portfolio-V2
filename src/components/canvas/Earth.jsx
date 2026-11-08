import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Nigeria sits at about 8°E. Turning the globe by this angle brings it to face the viewer.
const NIGERIA_LON = 8;
const faceLongitude = (lon) => -(Math.PI / 2 + (lon * Math.PI) / 180);

const glowVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// outer halo: strongest next to the planet, fading to nothing at its own edge
const haloFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float k = -dot(vNormal, vec3(0.0, 0.0, 1.0));
    float i = pow(clamp(k * 2.1, 0.0, 1.0), 2.2);
    gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * i * 0.95;
  }
`;

// thin bright rim on the planet's own edge
const rimFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float k = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
    float i = pow(k, 3.0);
    gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * i * 0.9;
  }
`;

export default function Earth({ onReady }) {
  const [day, spec, clouds] = useTexture([
    "/earth/earth-day.webp",
    "/earth/earth-spec.webp",
    "/earth/earth-clouds.webp",
  ]);
  const cloudRef = useRef(null);

  // textures are loaded (Suspense finished): tell the page it can fade the globe in
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // clouds drift slowly over the surface
  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += Math.min(delta, 0.05) * 0.02;
  });

  return (
    <>
      {/* lights: sun from the upper right, a faint blue rim light from behind */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 1.5, 5]} intensity={2.6} />
      <directionalLight position={[-4, -1, -2]} intensity={0.7} color="#38bdf8" />

      <Stars radius={60} depth={40} count={1500} factor={3} saturation={0} fade speed={0.6} />

      {/* slight tilt so you also see a little of the north */}
      <group rotation={[0.18, 0, 0]}>
        <group rotation={[0, faceLongitude(NIGERIA_LON), 0]}>
          {/* Earth: day map + specular map (oceans catch the light) */}
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhongMaterial map={day} specularMap={spec} specular="#4a7fb5" shininess={22} />
          </mesh>

          {/* clouds: white = cloud, black = see-through */}
          <mesh ref={cloudRef}>
            <sphereGeometry args={[1.012, 64, 64]} />
            <meshStandardMaterial
              color="#ffffff"
              alphaMap={clouds}
              transparent
              opacity={0.85}
              roughness={1}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* atmosphere: thin rim on the planet, then a wider glow outside it */}
        <mesh>
          <sphereGeometry args={[1.025, 64, 64]} />
          <shaderMaterial
            vertexShader={glowVertex}
            fragmentShader={rimFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.14, 64, 64]} />
          <shaderMaterial
            vertexShader={glowVertex}
            fragmentShader={haloFragment}
            transparent
            depthWrite={false}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </>
  );
}