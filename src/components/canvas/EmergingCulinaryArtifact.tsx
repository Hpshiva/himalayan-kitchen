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
  activeDishCategory = 'nepali',
}: EmergingCulinaryArtifactProps) {
  const groupRef = useRef<THREE.Group>(null);
  const plateRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Points>(null);

  const isLight = theme === 'light';

  // Preload and configure high-resolution authentic culinary textures
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const momoTex = loader.load('/images/morel_momo.jpg');
    const wokTex = loader.load('/images/wok_dish.jpg');
    const cocktailTex = loader.load('/images/botanical_cocktail.jpg');

    // 1200x896 aspect ratio crop: 896/1200 = 0.7467
    // Crops exact 1:1 square center with zero stretching or distortion
    [momoTex, wokTex, cocktailTex].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(0.7467, 1);
      tex.offset.set(0.1266, 0);
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    return {
      nepali: momoTex,
      indochinese: wokTex,
      botanical: cocktailTex,
    };
  }, []);

  const activeTexture = textures[activeDishCategory] || textures.nepali;

  // Hot rising botanical steam particles (rising smoothly from hot food)
  const [steamPositions, steamVelocities] = useMemo(() => {
    const count = 90;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.4;
      pos[i * 3 + 1] = 0.1 + Math.random() * 2.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = 0.016 + Math.random() * 0.022;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // PINNED HERO SCROLL TIMELINE (based on heroProgress 0.0 to 1.0):
    // 0.00 - 0.15: Buried inside the mountain cleft, scale = 0
    // 0.15 - 0.45: Mountains part, plate rises from canyon fissure to center
    // 0.45 - 0.75: Primary Interactive Altar stage (hovering, tilting, interactive mouse reaction)
    // 0.75 - 0.92: Lowers into the hearth lodge table position
    // > 0.92: Seamless handoff to Journey section

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
      scale = THREE.MathUtils.lerp(0.05, 0.62, smoothP);
    } else if (heroProgress < 0.75) {
      // Primary Hero stage: Perfectly centered, gently levitating
      posY = -0.55 + Math.sin(t * 1.2) * 0.06;
      posZ = 9.2;
      scale = 0.62;
    } else if (heroProgress < 0.92) {
      // Lowering into table
      const p = (heroProgress - 0.75) / 0.17;
      posY = THREE.MathUtils.lerp(-0.55, -4.5, p);
      posZ = THREE.MathUtils.lerp(9.2, 4.0, p);
      scale = THREE.MathUtils.lerp(0.62, 0.0, p);
    } else {
      scale = 0;
    }

    // Apply interactive 3D position & subtle mouse tilt (centered on both axes)
    groupRef.current.position.set(
      pointer.x * 0.4,
      posY + pointer.y * 0.12,
      posZ
    );
    groupRef.current.scale.setScalar(scale);

    // Natural Fine-Dining Presentation Angles:
    // Platter is tilted forward toward the camera so the guest looks down at the appetizing food.
    // Subtle mouse reaction and gentle living sway, without spinning 360° like a microwave.
    const forwardTilt = -0.42; // ~24° forward tilt toward camera
    groupRef.current.rotation.x = forwardTilt - pointer.y * 0.18 + Math.sin(t * 0.5) * 0.02;
    groupRef.current.rotation.y = pointer.x * 0.35 + Math.sin(t * 0.35) * 0.06;
    groupRef.current.rotation.z = -pointer.x * 0.08;

    // Steam simulation
    if (steamRef.current && scale > 0.2) {
      const posAttr = steamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 90; i++) {
        posArr[i * 3 + 1] += steamVelocities[i * 3 + 1];
        posArr[i * 3] += steamVelocities[i * 3] + Math.sin(t * 1.8 + i) * 0.002;
        posArr[i * 3 + 2] += steamVelocities[i * 3 + 2];

        if (posArr[i * 3 + 1] > 2.6) {
          posArr[i * 3 + 1] = 0.1;
          posArr[i * 3] = (Math.random() - 0.5) * 1.1;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 1.1;
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
      {/* 1. Volcanic Basalt Slate Platter Base */}
      <mesh ref={plateRef} position={[0, -0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.55, 2.4, 0.24, 64]} />
        <meshStandardMaterial
          color={isLight ? '#282d33' : '#111417'}
          roughness={0.76}
          metalness={0.24}
        />
      </mesh>

      {/* Hand-hammered Himalayan Brass Rim Inlay (Flat on the slate) */}
      <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.16, 2.28, 64]} />
        <meshStandardMaterial
          color="#d9642a"
          roughness={0.25}
          metalness={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Recessed Dark Handcrafted Ceramic Dish Rim */}
      <mesh position={[0, -0.07, 0]}>
        <cylinderGeometry args={[2.1, 2.06, 0.08, 64]} />
        <meshStandardMaterial
          color={isLight ? '#1c1f23' : '#0c0e10'}
          roughness={0.65}
          metalness={0.35}
        />
      </mesh>

      {/* 2. THE PHOTOREALISTIC CULINARY CENTERPIECE (Michelin Food Photography Canvas) */}
      <mesh position={[0, -0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <circleGeometry args={[2.02, 64]} />
        <meshPhysicalMaterial
          map={activeTexture}
          roughness={0.22}
          reflectivity={0.65}
          clearcoat={0.65}
          clearcoatRoughness={0.18}
          toneMapped={true}
        />
      </mesh>

      {/* Soft Vignette Rim Blend Ring (Seamlessly blends photo edge into ceramic plate) */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.88, 2.03, 64]} />
        <meshBasicMaterial
          color={isLight ? '#1c1f23' : '#0c0e10'}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Soft Rising Hot Culinary Steam Wisps */}
      <points ref={steamRef} position={[0, 0.15, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          map={steamTexture}
          color={isLight ? '#6b6154' : '#f0ebe2'}
          transparent
          opacity={0.32}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Warm Platter Hearth Uplight */}
      <pointLight
        position={[0, 0.8, 1.2]}
        color="#e07534"
        intensity={2.6}
        distance={8}
        decay={2}
      />
    </group>
  );
}


