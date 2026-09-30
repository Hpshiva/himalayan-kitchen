import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Creates a delicate, anti-aliased white circular snowflake texture
function createWhiteCircleSnowTexture(isLight = false): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const center = size / 2;
    const radius = size / 2 - 4;

    if (isLight) {
      // Subtle shadow contour ensures the white circular shape is clearly defined
      ctx.shadowColor = 'rgba(25, 40, 60, 0.28)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();

      // Soft circular gradient for a pristine snowy look
      ctx.shadowColor = 'transparent';
      const grad = ctx.createRadialGradient(center - radius * 0.2, center - radius * 0.2, 0, center, center, radius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.8, '#ffffff');
      grad.addColorStop(1, 'rgba(240, 245, 255, 0.9)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Dark mode: Radiant glowing white circular particle
      const glowGrad = ctx.createRadialGradient(center, center, radius * 0.3, center, center, radius + 2);
      glowGrad.addColorStop(0, '#ffffff');
      glowGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.95)');
      glowGrad.addColorStop(0.9, 'rgba(220, 240, 255, 0.5)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(center, center, radius + 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center, center, radius * 0.7, 0, Math.PI * 2);
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
  const emberRef = useRef<THREE.Points>(null);

  const isLight = theme === 'light';

  // Delicate, sparse, peaceful particle count (not overwhelming or blizzard-like)
  const particleCount = 260;
  const emberCount = 220;

  // Textures
  const snowTexture = useMemo(() => createWhiteCircleSnowTexture(isLight), [isLight]);
  const emberTexture = useMemo(() => createEmberTexture(), []);

  // Sparse snow positions and slow, graceful velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 40 - 5;
      pos[i * 3 + 2] = Math.random() * 35 + 2; // Directly in front of camera

      vel[i * 3] = (Math.random() - 0.5) * 0.016; // Gentle lateral drift
      vel[i * 3 + 1] = -0.012 - Math.random() * 0.018; // Slow, floaty descent
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.012;
    }
    return [pos, vel];
  }, [particleCount]);

  // Hearth Embers
  const [emberPositions, emberVelocities] = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const vel = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = Math.random() * 15 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;

      vel[i * 3] = (Math.random() - 0.5) * 0.015;
      vel[i * 3 + 1] = 0.025 + Math.random() * 0.04;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }
    return [pos, vel];
  }, [emberCount]);

  useFrame((state) => {
    const mouseX = state.pointer.x * 1.5;

    // Animate Gentle White Circle Snow
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i * 3] + mouseX * 0.003;
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];

        // Loop boundaries gently
        if (posArr[i * 3 + 1] < -6) {
          posArr[i * 3 + 1] = 36;
          posArr[i * 3] = (Math.random() - 0.5) * 60;
          posArr[i * 3 + 2] = Math.random() * 35 + 2;
        }
        if (posArr[i * 3] > 32) posArr[i * 3] = -32;
        if (posArr[i * 3] < -32) posArr[i * 3] = 32;
      }
      posAttr.needsUpdate = true;
    }

    // Animate Embers
    if (emberRef.current) {
      const emberAttr = emberRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const emberArr = emberAttr.array as Float32Array;

      for (let i = 0; i < emberCount; i++) {
        emberArr[i * 3] += emberVelocities[i * 3];
        emberArr[i * 3 + 1] += emberVelocities[i * 3 + 1];
        emberArr[i * 3 + 2] += emberVelocities[i * 3 + 2];

        if (emberArr[i * 3 + 1] > 20) {
          emberArr[i * 3 + 1] = -5;
          emberArr[i * 3] = (Math.random() - 0.5) * 28;
        }
      }
      emberAttr.needsUpdate = true;

      const emberMat = emberRef.current.material as THREE.PointsMaterial;
      emberMat.opacity = THREE.MathUtils.lerp(
        0.05,
        0.80,
        Math.min(1, Math.max(0, (scrollProgress - 0.25) * 2))
      );
    }
  });

  return (
    <group>
      {/* Gentle White Circle Snowflakes (Subtle, clearly circular, peaceful) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isLight ? 0.38 : 0.32}
          map={snowTexture}
          color="#ffffff"
          transparent
          opacity={isLight ? 0.70 : 0.75}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Culinary Hearth Embers */}
      <points ref={emberRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[emberPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.24}
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
