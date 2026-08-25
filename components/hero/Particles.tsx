"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = new THREE.Color("#b08d57");

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uProgress;
  uniform float uOpacity;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Mouvement organique très lent : dérive verticale + oscillation latérale.
    pos.y += sin(uTime * aSpeed + aPhase) * 0.22;
    pos.x += cos(uTime * aSpeed * 0.7 + aPhase * 1.7) * 0.18;
    pos.z += sin(uTime * aSpeed * 0.5 + aPhase * 0.6) * 0.15;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (1.0 / -mv.z);

    // Scintillement doux, et apparition progressive.
    float twinkle = 0.55 + 0.45 * sin(uTime * aSpeed * 2.2 + aPhase);
    vAlpha = twinkle * uProgress * uOpacity;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Point rond à bords doux — pas de texture externe à charger.
    float d = length(gl_PointCoord - vec2(0.5));
    float mask = smoothstep(0.5, 0.05, d);
    if (mask < 0.01) discard;
    gl_FragColor = vec4(uColor, mask * vAlpha);
  }
`;

/**
 * « Lucioles / poussière dorée » — le fil rouge visuel du site.
 * Plus dense vers le haut de l'image (près des guirlandes).
 *
 * Hero : 220 points. Intros de section : 60 points (version allégée).
 */
export function Particles({
  count = 220,
  spread = 8,
  /** Hauteur totale couverte, en unités monde (viewport ≈ 4.14 à z = 0). */
  height = 4.8,
  /** Taille de base des points, en pixels à z = 5. Volontairement minuscule :
   *  on veut de la poussière dorée, pas du bokeh. */
  size = 22,
  fadeIn = true,
  /** Additif sur les sections sombres ; normal sur la pierre claire. */
  blending = "additive",
  opacity = 1,
}: {
  count?: number;
  spread?: number;
  height?: number;
  size?: number;
  fadeIn?: boolean;
  blending?: "additive" | "normal";
  opacity?: number;
}) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Biais vers le haut : u^0.55 > u sur [0,1], la distribution se densifie
      // donc vers le haut du cadre, là où pendent les guirlandes.
      const u = Math.random();
      const half = height / 2;
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = -half + height * Math.pow(u, 0.55);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.4;

      scales[i] = 0.45 + Math.random() * 0.9;
      speeds[i] = 0.08 + Math.random() * 0.16;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return g;
  }, [count, spread, height]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uColor: { value: GOLD },
      uProgress: { value: fadeIn ? 0 : 1 },
      uOpacity: { value: opacity },
    }),
    [size, fadeIn, opacity],
  );

  useFrame((_, delta) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value += delta;
    // Apparition progressive des particules (≈ 2,5 s).
    const p = material.current.uniforms.uProgress;
    if (p.value < 1) p.value = Math.min(1, p.value + delta / 2.5);
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={
          blending === "additive" ? THREE.AdditiveBlending : THREE.NormalBlending
        }
      />
    </points>
  );
}
