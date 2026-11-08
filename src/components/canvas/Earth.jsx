import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

// ---- settings you can tweak ----
const NIGERIA = { lat: 9.1, lon: 8.7 };
const SPIN_SPEED = 0.18; // radians per second (bigger = faster)
const GLOW = "#38bdf8";

// turning the globe by this angle brings a longitude to face the viewer
const faceLongitude = (lon) => -(Math.PI / 2 + (lon * Math.PI) / 180);

// latitude/longitude -> a point on the sphere (matches how three.js wraps the texture)
const toVector = (lat, lon) => {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo));
};

// ---- planet: recolours the real map into the blue theme ----
const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragment = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uSpec;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec3 tex = texture2D(uDay, vUv).rgb;

    // land vs ocean: ocean is the only part of the map where blue clearly wins
    float land = smoothstep(0.02, 0.16, max(tex.r, tex.g) - tex.b * 0.8);
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));

    vec3 ocean = vec3(0.015, 0.07, 0.26);
    vec3 landDark = vec3(0.06, 0.30, 0.75);
    vec3 landLight = vec3(0.45, 0.85, 1.0);
    vec3 landColor = mix(landDark, landLight, smoothstep(0.15, 0.9, lum));
    vec3 base = mix(ocean, landColor, land);

    // light from the upper right, never fully dark on the shadow side
    vec3 n = normalize(vNormal);
    vec3 L = normalize(vec3(0.55, 0.35, 0.75));
    float diffuse = max(dot(n, L), 0.0);
    vec3 col = base * (0.42 + 0.95 * diffuse);

    // sun glint on the oceans
    float oceanMask = texture2D(uSpec, vUv).r;
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float glint = pow(max(dot(n, H), 0.0), 40.0) * oceanMask;
    col += vec3(0.4, 0.8, 1.0) * glint * 0.8;

    // glowing edge
    float rim = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
    col += vec3(0.22, 0.74, 0.97) * rim * 0.9;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ---- atmosphere ----
const glowVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float k = -dot(vNormal, vec3(0.0, 0.0, 1.0));
    float i = pow(clamp(k * 2.1, 0.0, 1.0), 2.2);
    gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * i * 1.05;
  }
`;

const rimFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float k = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
    float i = pow(k, 3.0);
    gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * i * 0.9;
  }
`;

// ---- the glowing pin on Nigeria ----
const glowMaterial = {
  color: "#7dd3fc",
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  toneMapped: false,
};

function Pin({ lat, lon }) {
  const group = useRef(null);
  const ring1 = useRef(null);
  const ring2 = useRef(null);
  const head = useRef(null);
  const halo = useRef(null);

  // stand the pin on the surface, pointing straight out of the planet
  useLayoutEffect(() => {
    const p = toVector(lat, lon);
    group.current.position.copy(p);
    group.current.lookAt(p.clone().multiplyScalar(2));
  }, [lat, lon]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    [ring1, ring2].forEach((ring, i) => {
      const k = (t * 0.55 + i * 0.5) % 1; // 0 -> 1, repeating
      ring.current.scale.setScalar(0.02 + k * 0.17);
      ring.current.material.opacity = (1 - k) * 0.85;
    });
    const beat = 1 + 0.25 * Math.sin(t * 4);
    head.current.scale.setScalar(beat);
    halo.current.scale.setScalar(1 + 0.5 * Math.sin(t * 4 + 0.6));
    halo.current.material.opacity = 0.28 + 0.14 * Math.sin(t * 4 + 0.6);
  });

  return (
    <group ref={group}>
      {/* ripples spreading across the surface */}
      <mesh ref={ring1} position={[0, 0, 0.004]}>
        <ringGeometry args={[0.85, 1, 48]} />
        <meshBasicMaterial {...glowMaterial} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} position={[0, 0, 0.004]}>
        <ringGeometry args={[0.85, 1, 48]} />
        <meshBasicMaterial {...glowMaterial} side={THREE.DoubleSide} />
      </mesh>

      {/* base dot */}
      <mesh position={[0, 0, 0.006]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial {...glowMaterial} color="#ffffff" />
      </mesh>

      {/* beam pointing out of the planet */}
      <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.006, 0.22, 8]} />
        <meshBasicMaterial {...glowMaterial} opacity={0.75} />
      </mesh>

      {/* glowing head */}
      <mesh ref={head} position={[0, 0, 0.225]}>
        <sphereGeometry args={[0.016, 16, 16]} />
        <meshBasicMaterial {...glowMaterial} color="#ffffff" />
      </mesh>
      <mesh ref={halo} position={[0, 0, 0.225]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial {...glowMaterial} opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function Earth({ onReady }) {
  const [day, spec, clouds] = useTexture([
    "/earth/earth-day.webp",
    "/earth/earth-spec.webp",
    "/earth/earth-clouds.webp",
  ]);
  const spin = useRef(null);
  const cloudRef = useRef(null);

  // the shader reads the raw map colours
  useLayoutEffect(() => {
    [day, spec, clouds].forEach((tex) => {
      tex.colorSpace = THREE.NoColorSpace;
      tex.needsUpdate = true;
    });
  }, [day, spec, clouds]);

  const uniforms = useMemo(() => ({ uDay: { value: day }, uSpec: { value: spec } }), [day, spec]);

  // textures are loaded (Suspense finished): tell the page it can fade the globe in
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useFrame(({ clock }, delta) => {
    if (spin.current) {
      spin.current.rotation.y = faceLongitude(NIGERIA.lon) + clock.elapsedTime * SPIN_SPEED;
    }
    // clouds drift a little faster than the ground
    if (cloudRef.current) cloudRef.current.rotation.y += Math.min(delta, 0.05) * 0.03;
  });

  return (
    <>
      <Stars radius={60} depth={40} count={1500} factor={3} saturation={0} fade speed={0.6} />

      {/* slight tilt toward the viewer so the north is visible */}
      <group rotation={[0.18, 0, 0]}>
        <group ref={spin}>
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
              vertexShader={earthVertex}
              fragmentShader={earthFragment}
              uniforms={uniforms}
            />
          </mesh>

          {/* glowing clouds: white = cloud, black = see-through */}
          <mesh ref={cloudRef}>
            <sphereGeometry args={[1.012, 64, 64]} />
            <meshBasicMaterial
              color="#cfeeff"
              alphaMap={clouds}
              transparent
              opacity={0.5}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <Pin lat={NIGERIA.lat} lon={NIGERIA.lon} />
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