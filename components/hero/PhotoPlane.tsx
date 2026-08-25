"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Parallaxe de profondeur simulée : la photo est légèrement sur-échantillonnée
 * (uZoom) puis décalée selon la souris. Le décalage croît du centre vers les
 * bords (facteur `depth`), ce qui donne la sensation d'un plan qui a du relief
 * sans modèle 3D ni depth map à charger.
 */
const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uOffset;
  uniform float uZoom;
  uniform float uScale;   // fondu d'entrée : la photo « respire »
  uniform float uFade;    // fondu depuis le noir
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) / (uZoom * uScale) + 0.5;

    // Les bords se déplacent davantage que le centre.
    float depth = length(vUv - 0.5) * 1.6 + 0.35;
    uv += uOffset * depth;

    vec3 color = texture2D(uTexture, uv).rgb;

    // Dégradé ink-900 vers le bas : lisibilité de la typographie superposée.
    float shade = smoothstep(0.0, 0.62, vUv.y);
    color = mix(vec3(0.110, 0.102, 0.090), color, 0.38 + 0.62 * shade);

    gl_FragColor = vec4(color * uFade, 1.0);
  }
`;

export function PhotoPlane({ src }: { src: string }) {
  const texture = useTexture(src);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const elapsed = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uZoom: { value: 1.0 },
      uScale: { value: 1.06 },
      uFade: { value: 0 },
    }),
    [texture],
  );

  /**
   * Cadrage « object-cover » : on compare le ratio de la photo à celui du
   * viewport et on zoome dans l'axe le plus contraint. La photo n'est jamais
   * déformée.
   */
  const zoom = useMemo(() => {
    const image = texture.image as { width: number; height: number } | undefined;
    if (!image?.width || !image?.height) return 1;
    const photoRatio = image.width / image.height;
    const viewRatio = size.width / size.height;
    return photoRatio > viewRatio ? 1 : viewRatio / photoRatio;
  }, [texture, size.width, size.height]);

  useFrame((state, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;

    // ± 8 px max, converti en UV, avec easing lent.
    const maxPx = 8;
    target.current.x = (state.pointer.x * maxPx) / size.width;
    target.current.y = (state.pointer.y * maxPx) / size.height;

    const ease = 1 - Math.pow(0.001, delta); // easing exponentiel, cadence-indépendant
    current.current.x += (target.current.x - current.current.x) * ease * 0.35;
    current.current.y += (target.current.y - current.current.y) * ease * 0.35;
    u.uOffset.value.set(current.current.x, current.current.y);

    // Entrée : fondu depuis le noir + respiration 1.06 → 1.0 sur 2,4 s.
    elapsed.current += delta;
    const t = Math.min(1, elapsed.current / 2.4);
    const eased = 1 - Math.pow(1 - t, 3);
    u.uScale.value = 1.06 - 0.06 * eased;
    u.uFade.value = Math.min(1, elapsed.current / 1.1);
    u.uZoom.value = zoom;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
