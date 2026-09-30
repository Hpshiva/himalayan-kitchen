import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface EmergingCulinaryArtifactProps {
  scrollProgress: number;
  heroProgress?: number;
  theme?: 'dark' | 'light';
  activeDishCategory?: 'nepali' | 'indochinese' | 'botanical';
}

export function EmergingCulinaryArtifact({
  heroProgress = 0,
  theme = 'light',
}: EmergingCulinaryArtifactProps) {
  const groupRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Points>(null);
  const embersRef = useRef<THREE.Points>(null);

  const isLight = theme === 'light';

  // Hot rising culinary steam particles
  const [steamPositions, steamVelocities] = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 1] = 0.2 + Math.random() * 2.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.8;

      vel[i * 3] = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 1] = 0.018 + Math.random() * 0.024;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }
    return [pos, vel];
  }, []);

  // Golden alpine embers rising from the cleft hearth
  const [emberPositions, emberVelocities] = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.4;
      pos[i * 3 + 1] = Math.random() * 3.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.4;

      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = 0.015 + Math.random() * 0.035;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // PINNED HERO SCROLL TIMELINE (based on heroProgress 0.0 to 1.0):
    let posY = -16;
    let posZ = 3;
    let scale = 0;

    if (heroProgress < 0.15) {
      posY = -16;
      posZ = 3;
      scale = 0;
    } else if (heroProgress < 0.45) {
      const p = (heroProgress - 0.15) / 0.30;
      const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
      posY = THREE.MathUtils.lerp(-12, -0.55, smoothP);
      posZ = THREE.MathUtils.lerp(3, 9.2, smoothP);
      scale = THREE.MathUtils.lerp(0.05, 0.65, smoothP);
    } else if (heroProgress < 0.75) {
      posY = -0.55 + Math.sin(t * 1.2) * 0.06;
      posZ = 9.2;
      scale = 0.65;
    } else if (heroProgress < 0.92) {
      const p = (heroProgress - 0.75) / 0.17;
      posY = THREE.MathUtils.lerp(-0.55, -4.5, p);
      posZ = THREE.MathUtils.lerp(9.2, 4.0, p);
      scale = THREE.MathUtils.lerp(0.65, 0.0, p);
    } else {
      scale = 0;
    }

    groupRef.current.position.set(
      pointer.x * 0.35,
      posY + pointer.y * 0.12,
      posZ
    );
    groupRef.current.scale.setScalar(scale);

    // Steam simulation
    if (steamRef.current && scale > 0.2) {
      const posAttr = steamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 100; i++) {
        posArr[i * 3 + 1] += steamVelocities[i * 3 + 1];
        posArr[i * 3] += steamVelocities[i * 3] + Math.sin(t * 1.8 + i) * 0.002;
        posArr[i * 3 + 2] += steamVelocities[i * 3 + 2];

        if (posArr[i * 3 + 1] > 3.2) {
          posArr[i * 3 + 1] = 0.1;
          posArr[i * 3] = (Math.random() - 0.5) * 1.5;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Embers simulation
    if (embersRef.current && scale > 0.2) {
      const posAttr = embersRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 60; i++) {
        posArr[i * 3 + 1] += emberVelocities[i * 3 + 1];
        posArr[i * 3] += emberVelocities[i * 3] + Math.sin(t * 2.5 + i) * 0.004;
        posArr[i * 3 + 2] += emberVelocities[i * 3 + 2];

        if (posArr[i * 3 + 1] > 3.8) {
          posArr[i * 3 + 1] = 0.2;
          posArr[i * 3] = (Math.random() - 0.5) * 2.0;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  // Soft circular steam puff texture
  const steamTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const center = size / 2;
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(0.38, 'rgba(255, 255, 255, 0.28)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, center, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={groupRef} visible={heroProgress > 0.12 && heroProgress < 0.92}>
      {/* 1. Atmospheric Hot Culinary Steam Rising from Cleft Hearth */}
      <points ref={steamRef} position={[0, 0.1, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.34}
          map={steamTexture}
          color={isLight ? '#635a4d' : '#f2eee6'}
          transparent
          opacity={0.32}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Shimmering Golden Alpine Embers */}
      <points ref={embersRef} position={[0, 0.2, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[emberPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#d9642a"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 3. Sacred Cleft Hearth Fire Uplight */}
      <pointLight
        position={[0, 0.6, 1.2]}
        color="#e07534"
        intensity={2.8}
        distance={9}
        decay={2}
      />
    </group>
  );
}



