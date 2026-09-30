import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Creates a crisp, beautiful white circular snowflake texture
// In light mode: pure white disc with a subtle soft ambient shadow so it pops clearly against white snow & sky
// In dark mode: luminescent pure white glowing sphere
function createWhiteCircleSnowTexture(isLight = false): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const center = size / 2;
    const radius = size / 2 - 8;

    if (isLight) {
      // Subtle shadow contour ensures white circle is 100% visible against light snow backgrounds
      ctx.shadowColor = 'rgba(20, 35, 55, 0.35)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner crisp white sheen
      ctx.shadowColor = 'transparent';
      const innerGrad = ctx.createRadialGradient(center - radius * 0.2, center - radius * 0.2, 0, center, center, radius);
      innerGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      innerGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.98)');
      innerGrad.addColorStop(1, 'rgba(240, 248, 255, 0.92)');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Dark mode: Radiant glowing white circular particle
      const glowGrad = ctx.createRadialGradient(center, center, radius * 0.35, center, center, radius + 4);
      glowGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      glowGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.95)');
      glowGrad.addColorStop(0.88, 'rgba(220, 240, 255, 0.6)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
      ctx.fill();

      // Intense white core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center, center, radius * 0.72, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Embers texture
function createEmberTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const center = size / 2;
    const radius = size / 2 - 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 170, 50, 0.9)');
    gradient.addColorStop(0.8, 'rgba(224, 83, 27, 0.5)');
    gradient.addColorStop(1, 'rgba(224, 83, 27, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function AlpineSnow({
  scrollProgress,
  theme = 'light',
}: {
  scrollProgress: number;
  theme?: 'dark' | 'light';
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const fgPointsRef = useRef<THREE.Points>(null);
  const emberRef = useRef<THREE.Points>(null);

  const isLight = theme === 'light';

  // 1. Midground White Circle Snow
  const particleCount = 1200;
  // 2. Foreground Large Fluffy White Circles (clearly visible drifting discs)
  const fgParticleCount = 280;
  // 3. Hearth Embers
  const emberCount = 350;

  // Textures
  const snowTexture = useMemo(() => createWhiteCircleSnowTexture(isLight), [isLight]);
  const emberTexture = useMemo(() => createEmberTexture(), []);

  // Midground snow positions
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = Math.random() * 44 - 6;
      pos[i * 3 + 2] = Math.random() * 45 - 5; // Directly in front of camera

      vel[i * 3] = (Math.random() - 0.5) * 0.035;
      vel[i * 3 + 1] = -0.025 - Math.random() * 0.045; // Downward fall
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.025;
    }
    return [pos, vel];
  }, [particleCount]);

  // Foreground larger fluffy white circles (close to camera, unmistakable round snow)
  const [fgPositions, fgVelocities] = useMemo(() => {
    const pos = new Float32Array(fgParticleCount * 3);
    const vel = new Float32Array(fgParticleCount * 3);

    for (let i = 0; i < fgParticleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = Math.random() * 42 - 6;
      pos[i * 3 + 2] = Math.random() * 24 + 14; // High visibility foreground

      vel[i * 3] = (Math.random() - 0.5) * 0.025;
      vel[i * 3 + 1] = -0.018 - Math.random() * 0.035;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }
    return [pos, vel];
  }, [fgParticleCount]);

  // Hearth Embers
  const [emberPositions, emberVelocities] = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const vel = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 15 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = 0.03 + Math.random() * 0.05;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return [pos, vel];
  }, [emberCount]);

  useFrame((state) => {
    const mouseX = state.pointer.x * 2.0;

    // 1. Animate Midground White Circle Snow
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i * 3] + mouseX * 0.005;
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];

        // Loop boundaries
        if (posArr[i * 3 + 1] < -6) {
          posArr[i * 3 + 1] = 38;
          posArr[i * 3] = (Math.random() - 0.5) * 70;
          posArr[i * 3 + 2] = Math.random() * 45 - 5;
        }
        if (posArr[i * 3] > 36) posArr[i * 3] = -36;
        if (posArr[i * 3] < -36) posArr[i * 3] = 36;
      }
      posAttr.needsUpdate = true;
    }

    // 2. Animate Foreground Large Fluffy White Circles
    if (fgPointsRef.current) {
      const fgAttr = fgPointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const fgArr = fgAttr.array as Float32Array;

      for (let i = 0; i < fgParticleCount; i++) {
        fgArr[i * 3] += fgVelocities[i * 3] + mouseX * 0.007;
        fgArr[i * 3 + 1] += fgVelocities[i * 3 + 1];
        fgArr[i * 3 + 2] += fgVelocities[i * 3 + 2];

        if (fgArr[i * 3 + 1] < -6) {
          fgArr[i * 3 + 1] = 36;
          fgArr[i * 3] = (Math.random() - 0.5) * 45;
          fgArr[i * 3 + 2] = Math.random() * 24 + 14;
        }
        if (fgArr[i * 3] > 24) fgArr[i * 3] = -24;
        if (fgArr[i * 3] < -24) fgArr[i * 3] = 24;
      }
      fgAttr.needsUpdate = true;
    }

    // 3. Animate Embers
    if (emberRef.current) {
      const emberAttr = emberRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const emberArr = emberAttr.array as Float32Array;

      for (let i = 0; i < emberCount; i++) {
        emberArr[i * 3] += emberVelocities[i * 3];
        emberArr[i * 3 + 1] += emberVelocities[i * 3 + 1];
        emberArr[i * 3 + 2] += emberVelocities[i * 3 + 2];

        if (emberArr[i * 3 + 1] > 20) {
          emberArr[i * 3 + 1] = -5;
          emberArr[i * 3] = (Math.random() - 0.5) * 30;
        }
      }
      emberAttr.needsUpdate = true;

      const emberMat = emberRef.current.material as THREE.PointsMaterial;
      emberMat.opacity = THREE.MathUtils.lerp(
        0.05,
        0.85,
        Math.min(1, Math.max(0, (scrollProgress - 0.25) * 2))
      );
    }
  });

  return (
    <group>
      {/* Layer 1: Midground Falling White Circle Snowflakes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isLight ? 0.65 : 0.55}
          map={snowTexture}
          color="#ffffff"
          transparent
          opacity={isLight ? 0.95 : 0.88}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Layer 2: Foreground Large Fluffy White Circles (Clearly visible round falling snow) */}
      <points ref={fgPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[fgPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isLight ? 1.25 : 1.10}
          map={snowTexture}
          color="#ffffff"
          transparent
          opacity={isLight ? 0.98 : 0.92}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Layer 3: Culinary Hearth Embers */}
      <points ref={emberRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[emberPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          map={emberTexture}
          color="#e0531b"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
