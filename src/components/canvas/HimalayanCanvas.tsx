import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ProceduralMountains } from './ProceduralMountains';
import { AlpineSnow } from './AlpineSnow';
import { CameraRig } from './CameraRig';
import { EmergingCulinaryArtifact } from './EmergingCulinaryArtifact';

interface HimalayanCanvasProps {
  scrollProgress: number;
  heroProgress?: number;
  theme?: 'dark' | 'light';
  activeDishCategory?: 'nepali' | 'indochinese' | 'botanical';
}

export function HimalayanCanvas({
  scrollProgress,
  heroProgress = 0,
  theme = 'light',
  activeDishCategory = 'nepali',
}: HimalayanCanvasProps) {
  const [dpr, setDpr] = useState(1);
  const isLight = theme === 'light';

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, 1.6));
  }, []);

  const bgColor = isLight ? '#f2eee6' : '#050607';
  const fogColor = isLight ? '#e7e2d6' : '#080e16';

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden transition-colors duration-700">
      <Canvas
        camera={{ position: [0, 22, 48], fov: 45, near: 0.1, far: 250 }}
        dpr={dpr}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        <color attach="background" args={[bgColor]} />
        
        {/* Atmospheric Mountain Fog */}
        <fogExp2 attach="fog" args={[fogColor, isLight ? 0.013 : 0.009]} />

        {/* Ambient Mountain Sky Glow */}
        <ambientLight
          color={isLight ? '#fffdf7' : '#46607a'}
          intensity={isLight ? 1.3 : 1.4}
        />

        {/* Dawn / Moonlight Ridge Light */}
        <directionalLight
          position={[28, 48, 26]}
          color={isLight ? '#fff8f0' : '#ffffff'}
          intensity={isLight ? 2.2 : 2.6}
          castShadow
        />

        {/* Alpine Valley Fill Light */}
        <directionalLight
          position={[-30, 25, 15]}
          color={isLight ? '#e2ebf4' : '#8ab0d4'}
          intensity={isLight ? 1.1 : 1.3}
        />

        {/* High Summit Moon Backlight */}
        {!isLight && (
          <directionalLight
            position={[0, 45, -40]}
            color="#dceaff"
            intensity={1.3}
          />
        )}

        {/* Glacial River Water Shimmer Light */}
        <pointLight
          position={[0, 2.0, 10]}
          color={isLight ? '#38bdf8' : '#0284c7'}
          intensity={isLight ? 1.0 : 1.4}
          distance={32}
          decay={2}
        />

        {/* Hearth Fire / Cleft Core Glow */}
        <pointLight
          position={[0, 0.5, 2]}
          color="#d9642a"
          intensity={(isLight ? 1.2 : 0.9) + (heroProgress > 0.15 ? heroProgress * 3.5 : 0)}
          distance={35}
          decay={2}
        />

        <Suspense fallback={null}>
          <CameraRig scrollProgress={scrollProgress} heroProgress={heroProgress} />
          <ProceduralMountains scrollProgress={scrollProgress} heroProgress={heroProgress} theme={theme} />
          <EmergingCulinaryArtifact
            scrollProgress={scrollProgress}
            heroProgress={heroProgress}
            theme={theme}
            activeDishCategory={activeDishCategory}
          />
          <AlpineSnow scrollProgress={scrollProgress} theme={theme} />
        </Suspense>
      </Canvas>

      {/* Atmospheric Top & Bottom Vignettes adapted to theme */}
      <div
        className={`absolute top-0 left-0 w-full h-32 pointer-events-none transition-colors duration-700 ${
          isLight
            ? 'bg-gradient-to-b from-[#f2eee6] via-[#f2eee6]/60 to-transparent'
            : 'bg-gradient-to-b from-himalayan-void via-himalayan-void/60 to-transparent'
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-full h-40 pointer-events-none transition-colors duration-700 ${
          isLight
            ? 'bg-gradient-to-t from-[#f2eee6] via-[#f2eee6]/80 to-transparent'
            : 'bg-gradient-to-t from-himalayan-void via-himalayan-void/80 to-transparent'
        }`}
      />
    </div>
  );
}
