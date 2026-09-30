import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Creates a smooth circular particle texture with soft anti-aliased edges
function createCircleParticleTexture(hardness = 0.5): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const center = size / 2;
    const radius = size / 2 - 1;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(hardness, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
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

  const particleCount = 1400;
  const emberCount = 350;
  const isLight = theme === 'light';

  // Smooth circular textures for snow and embers
  const circleTexture = useMemo(() => createCircleParticleTexture(0.55), []);
  const emberTexture = useMemo(() => createCircleParticleTexture(0.4), []);

  // Snow crystals
  const [positions, velocities, scales] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const sca = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 40 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;

      vel[i * 3] = (Math.random() - 0.5) * 0.04; // gentle wind x
      vel[i * 3 + 1] = -0.02 - Math.random() * 0.04; // fall down y
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.03; // z drift

      sca[i] = Math.random() * 1.5 + 0.5;
    }
    return [pos, vel, sca];
  }, [particleCount]);

  // Hearth Embers (active in cuisine & restaurant sections)
  const [emberPositions, emberVelocities] = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const vel = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 15 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = 0.03 + Math.random() * 0.05; // float upward like hearth sparks
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return [pos, vel];
  }, [emberCount]);

  useFrame((state) => {
    // Animate Snow
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const mouseX = state.pointer.x * 2.0;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i * 3] + mouseX * 0.005;
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];

        // Loop boundaries
        if (posArr[i * 3 + 1] < -6) {
          posArr[i * 3 + 1] = 35;
          posArr[i * 3] = (Math.random() - 0.5) * 80;
        }
        if (posArr[i * 3] > 40) posArr[i * 3] = -40;
        if (posArr[i * 3] < -40) posArr[i * 3] = 40;
      }
      posAttr.needsUpdate = true;
    }

    // Animate Embers (increasing opacity as we scroll down to hearth)
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

      // Embers become prominent as user descends towards food and hearth
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
      {/* Alpine Snow Particles (Smooth Round Circles) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-scale"
            args={[scales, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isLight ? 0.22 : 0.20}
          map={circleTexture}
          color={isLight ? '#b8c5d1' : '#ffffff'}
          transparent
          opacity={isLight ? 0.75 : 0.85}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Culinary Hearth Embers (Smooth Round Sparks) */}
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
