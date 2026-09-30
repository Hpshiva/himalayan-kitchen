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
  const flameRef = useRef<THREE.Points>(null);
  const embersRef = useRef<THREE.Points>(null);
  const fireLightRef = useRef<THREE.PointLight>(null);

  const isLight = theme === 'light';

  // 1. Procedural Blazing Flame Tongue Particles (Concentrated in hearth core, rising & dancing)
  const [flamePositions, flameVelocities] = useMemo(() => {
    const count = 150;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Concentrated fire core
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.5) * 0.65;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 0.05 + Math.random() * 2.2;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      // Fast rising thermal velocity with upward draft
      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = 0.028 + Math.random() * 0.038;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    return [pos, vel];
  }, []);

  // 2. High-Altitude Golden Embers & Sparks (Popping & spiraling high into the sky)
  const [emberPositions, emberVelocities] = useMemo(() => {
    const count = 90;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.9;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.random() * 3.8;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      vel[i * 3] = (Math.random() - 0.5) * 0.012;
      vel[i * 3 + 1] = 0.022 + Math.random() * 0.045;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.012;
    }
    return [pos, vel];
  }, []);

  // Procedural Flame Tongue Texture (Incandescent white-yellow core fading to fiery orange-crimson)
  const flameTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const center = size / 2;

      // Vertical teardrop flame shape
      const gradient = ctx.createRadialGradient(
        center,
        center * 1.15,
        2,
        center,
        center * 0.9,
        size * 0.48
      );
      // Blazing hot white-yellow core
      gradient.addColorStop(0, 'rgba(255, 255, 220, 1.0)');
      gradient.addColorStop(0.2, 'rgba(255, 210, 60, 0.95)');
      // Fiery blazing orange body
      gradient.addColorStop(0.48, 'rgba(255, 110, 15, 0.82)');
      // Deep glowing crimson edges
      gradient.addColorStop(0.78, 'rgba(225, 40, 10, 0.45)');
      // Transparent edge falloff
      gradient.addColorStop(1, 'rgba(180, 20, 5, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      // Draw smooth flame teardrop
      ctx.ellipse(center, center * 1.05, size * 0.42, size * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Spark Star Texture
  const sparkTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const center = size / 2;
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.25, 'rgba(255, 220, 100, 0.9)');
      gradient.addColorStop(0.65, 'rgba(255, 120, 20, 0.5)');
      gradient.addColorStop(1, 'rgba(220, 40, 10, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, center, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
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
      scale = THREE.MathUtils.lerp(0.05, 0.7, smoothP);
    } else if (heroProgress < 0.75) {
      posY = -0.55 + Math.sin(t * 1.2) * 0.06;
      posZ = 9.2;
      scale = 0.7;
    } else if (heroProgress < 0.92) {
      const p = (heroProgress - 0.75) / 0.17;
      posY = THREE.MathUtils.lerp(-0.55, -4.5, p);
      posZ = THREE.MathUtils.lerp(9.2, 4.0, p);
      scale = THREE.MathUtils.lerp(0.7, 0.0, p);
    } else {
      scale = 0;
    }

    groupRef.current.position.set(
      pointer.x * 0.35,
      posY + pointer.y * 0.12,
      posZ
    );
    groupRef.current.scale.setScalar(scale);

    // Dynamic Hearth Fire Flicker
    if (fireLightRef.current) {
      const flicker =
        Math.sin(t * 18) * 0.45 +
        Math.sin(t * 31) * 0.3 +
        Math.cos(t * 47) * 0.2 +
        (Math.random() - 0.5) * 0.25;
      fireLightRef.current.intensity = (isLight ? 3.6 : 3.2) + flicker;
    }

    // 1. Fire Flame Physics: Licking, dancing, turbulent thermal draft
    if (flameRef.current && scale > 0.2) {
      const posAttr = flameRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 150; i++) {
        // Fast upward thermal acceleration
        posArr[i * 3 + 1] += flameVelocities[i * 3 + 1];

        // Dancing flame tongue turbulence & heat convection
        const wave = Math.sin(t * 9 + i * 1.8);
        posArr[i * 3] += flameVelocities[i * 3] + wave * 0.007;
        posArr[i * 3 + 2] += flameVelocities[i * 3 + 2] + Math.cos(t * 8 + i * 1.4) * 0.006;

        // Inward vortex pull as flames taper toward the apex
        posArr[i * 3] *= 0.995;
        posArr[i * 3 + 2] *= 0.995;

        // Reset dying flames back to hot hearth coal base
        if (posArr[i * 3 + 1] > 2.6) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.pow(Math.random(), 1.5) * 0.55;
          posArr[i * 3] = Math.cos(angle) * r;
          posArr[i * 3 + 1] = 0.05 + Math.random() * 0.15;
          posArr[i * 3 + 2] = Math.sin(angle) * r;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 2. Rising Golden Embers Physics: Popping & dancing high into the night
    if (embersRef.current && scale > 0.2) {
      const posAttr = embersRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 90; i++) {
        posArr[i * 3 + 1] += emberVelocities[i * 3 + 1];
        // Swirling embers
        posArr[i * 3] += emberVelocities[i * 3] + Math.sin(t * 4 + i) * 0.008;
        posArr[i * 3 + 2] += emberVelocities[i * 3 + 2] + Math.cos(t * 3.5 + i) * 0.008;

        if (posArr[i * 3 + 1] > 4.2) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.75;
          posArr[i * 3] = Math.cos(angle) * r;
          posArr[i * 3 + 1] = 0.1 + Math.random() * 0.2;
          posArr[i * 3 + 2] = Math.sin(angle) * r;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} visible={heroProgress > 0.12 && heroProgress < 0.92}>
      {/* 1. Glowing Hearth Coal Bed Base (Hot ember core) */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.75, 1.05, 0.08, 32]} />
        <meshBasicMaterial
          color="#ff3e00"
          transparent
          opacity={isLight ? 0.75 : 0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Primary Blazing Fire Flame Tongues (Licking upward with radiant heat) */}
      <points ref={flameRef} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[flamePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.52}
          map={flameTexture}
          color={isLight ? '#ff4f10' : '#ff6a18'}
          transparent
          opacity={isLight ? 0.9 : 0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 3. Intense Inner Fire Core (Incandescent white-yellow thermal heart) */}
      <points position={[0, 0.15, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[flamePositions.slice(0, 150), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          map={sparkTexture}
          color="#ffe57f"
          transparent
          opacity={isLight ? 0.95 : 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 4. Shimmering Golden Alpine Embers & Sparks */}
      <points ref={embersRef} position={[0, 0.1, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[emberPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.095}
          map={sparkTexture}
          color={isLight ? '#ff9100' : '#ffab40'}
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 5. Sacred Dynamic Flickering Hearth Firelight */}
      <pointLight
        ref={fireLightRef}
        position={[0, 0.45, 0.5]}
        color="#ff5511"
        intensity={3.4}
        distance={10}
        decay={2}
      />
    </group>
  );
}




