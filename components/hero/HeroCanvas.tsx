"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { useCanvasActive } from "@/lib/useCanvasActive";
import { PhotoPlane } from "./PhotoPlane";
import { Particles } from "./Particles";

/**
 * Hero photo-led augmenté en 3D — pas une scène modélisée.
 * Aucun modèle 3D externe n'est chargé.
 */
export default function HeroCanvas({ src }: { src: string | null }) {
  // Rendu en pause dès que le hero quitte le viewport ou que l'onglet passe
  // en arrière-plan.
  const { ref: wrapper, active } = useCanvasActive<HTMLDivElement>();

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: src === null }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Suspense fallback={null}>
          {src ? <PhotoPlane src={src} /> : null}
          <Particles count={220} />
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.62}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
            {src ? <Vignette offset={0.28} darkness={0.55} eskil={false} /> : <></>}
            <Noise opacity={0.045} premultiply />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
