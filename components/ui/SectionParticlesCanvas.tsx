"use client";

import { Canvas } from "@react-three/fiber";
import { useCanvasActive } from "@/lib/useCanvasActive";
import { Particles } from "@/components/hero/Particles";

/**
 * Version allégée du système de particules du hero (60 points) : le même fil
 * rouge visuel en intro des sections « Le Lieu » et « La Carte ».
 * Pas de postprocessing ici — la signature reste unique, jamais empilée.
 */
export default function SectionParticlesCanvas() {
  const { ref: wrapper, active } = useCanvasActive<HTMLDivElement>();

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Particles
          count={60}
          size={17}
          blending="normal"
          opacity={0.5}
        />
      </Canvas>
    </div>
  );
}
