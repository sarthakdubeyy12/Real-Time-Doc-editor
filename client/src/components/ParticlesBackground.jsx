// src/components/ParticlesBackground.jsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: "#1e3a8a", // Tailwind's blue-900
        },
        particles: {
          number: { value: 60 },
          color: { value: "#ffffff" },
          links: {
            enable: true,
            color: "#60a5fa", // blue-400
            distance: 130,
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.2,
            outModes: { default: "bounce" },
          },
          size: { value: { min: 1, max: 4 } },
          shape: { type: "circle" },
        },
      }}
    />
  );
};

export default ParticlesBackground;