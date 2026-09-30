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
  const orbitRef = useRef<THREE.Group>(null);

  const isLight = theme === 'light';

  // Procedural Dumpling / Momo geometry with authentic hand-pleated ridges
  const dumplingGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.35, 36, 28);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      if (y < -0.3) {
        pos.setY(i, -0.3 + (y + 0.3) * 0.15);
      } else {
        const angle = Math.atan2(z, x);
        const pleat = Math.sin(angle * 12) * 0.14 * Math.max(0, y);
        pos.setX(i, x * (1 + pleat));
        pos.setZ(i, z * (1 + pleat));
        if (y > 0.8) {
          pos.setX(i, x * 0.35);
          pos.setZ(i, z * 0.35);
        }
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Hot rising botanical steam particles
  const [steamPositions, steamVelocities] = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = Math.random() * 2.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      vel[i * 3] = (Math.random() - 0.5) * 0.007;
      vel[i * 3 + 1] = 0.024 + Math.random() * 0.032;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.007;
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // PINNED HERO SCROLL TIMELINE (based on heroProgress 0.0 to 1.0):
    // 0.00 - 0.15: Buried inside the mountain cleft, scale = 0
    // 0.15 - 0.48: Mountains part, plate rises from canyon fissure to center
    // 0.48 - 0.82: Primary Interactive Altar stage (hovering, tilting, 3D rotating)
    // 0.82 - 0.98: Lowers into the hearth lodge table position
    // > 0.98: Seamless handoff to Journey section

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
      posY = THREE.MathUtils.lerp(-12, 0.15, smoothP);
      posZ = THREE.MathUtils.lerp(3, 9.2, smoothP);
      scale = THREE.MathUtils.lerp(0.05, 0.58, smoothP);
    } else if (heroProgress < 0.72) {
      // Primary Hero stage: Refined, elegant scale (does not obstruct headers)
      posY = 0.15 + Math.sin(t * 1.4) * 0.08;
      posZ = 9.2;
      scale = 0.58;
    } else if (heroProgress < 0.90) {
      // Lowering into table
      const p = (heroProgress - 0.72) / 0.18;
      posY = THREE.MathUtils.lerp(0.15, -4.5, p);
      posZ = THREE.MathUtils.lerp(9.2, 4.0, p);
      scale = THREE.MathUtils.lerp(0.58, 0.0, p);
    } else {
      scale = 0;
    }

    // Apply interactive 3D position & subtle mouse tilt (never blocks text)
    groupRef.current.position.set(
      pointer.x * 0.9,
      posY + pointer.y * 0.22,
      posZ
    );
    groupRef.current.scale.setScalar(scale);

    // Continuous 3D rotation with mouse drag reaction
    groupRef.current.rotation.y = t * 0.30 + pointer.x * 0.65;
    groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.07 - pointer.y * 0.25;

    // Steam simulation
    if (steamRef.current && scale > 0.2) {
      const posAttr = steamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 180; i++) {
        posArr[i * 3 + 1] += steamVelocities[i * 3 + 1];
        posArr[i * 3] += steamVelocities[i * 3] + Math.sin(t * 2 + i) * 0.003;
        posArr[i * 3 + 2] += steamVelocities[i * 3 + 2];

        if (posArr[i * 3 + 1] > 3.2) {
          posArr[i * 3 + 1] = 0.5;
          posArr[i * 3] = (Math.random() - 0.5) * 1.0;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Orbiting Timur botanicals & sparks
    if (orbitRef.current) {
      orbitRef.current.rotation.y = -t * 0.42;
      orbitRef.current.rotation.z = Math.sin(t * 0.35) * 0.18;
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
      gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.35)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, center, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={groupRef} visible={heroProgress > 0.12 && heroProgress < 0.90}>
      {/* 1. Volcanic Slate Platter Base */}
      <mesh ref={plateRef} position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.6, 2.4, 0.24, 48]} />
        <meshStandardMaterial
          color={isLight ? '#383f47' : '#14181c'}
          roughness={0.65}
          metalness={0.35}
          flatShading
        />
      </mesh>

      {/* Gold leaf / Brass Inlay Ring on Plate */}
      <mesh position={[0, -0.27, 0]}>
        <ringGeometry args={[2.08, 2.22, 48]} />
        <meshStandardMaterial
          color="#d9642a"
          roughness={0.2}
          metalness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. The Centerpiece Culinary Form */}
      <group position={[0, 0.55, 0]}>
        {activeDishCategory === 'nepali' ? (
          <>
            {/* Hand-folded Morel Momo */}
            <mesh geometry={dumplingGeometry} castShadow>
              <meshPhysicalMaterial
                color={isLight ? '#fcf9f2' : '#f5efe2'}
                roughness={0.32}
                transmission={0.42}
                thickness={1.3}
                ior={1.46}
                reflectivity={0.65}
                clearcoat={0.9}
                clearcoatRoughness={0.2}
              />
            </mesh>
            {/* Edible Gold Crown */}
            <mesh position={[0, 1.5, 0]}>
              <octahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial color="#dfb76c" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Mountain Herb Microgreens */}
            <mesh position={[0.25, 1.38, 0.15]}>
              <dodecahedronGeometry args={[0.13, 0]} />
              <meshStandardMaterial color="#3e8255" roughness={0.5} />
            </mesh>
            <mesh position={[-0.22, 1.4, -0.12]}>
              <dodecahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial color="#7f4494" roughness={0.5} />
            </mesh>
          </>
        ) : activeDishCategory === 'indochinese' ? (
          <>
            {/* Scorched Tangra Tiger Prawn over Charcoal */}
            <mesh position={[0, 0.45, 0]} rotation={[0.4, 0.3, 0]}>
              <torusGeometry args={[1.1, 0.36, 16, 32, Math.PI * 1.55]} />
              <meshStandardMaterial color="#d45724" roughness={0.35} metalness={0.45} />
            </mesh>
            {/* Roasted Red Chili Pod */}
            <mesh position={[0.2, 0.9, -0.2]} rotation={[-0.3, 0.5, 0.4]}>
              <coneGeometry args={[0.18, 0.95, 12]} />
              <meshStandardMaterial color="#bf261b" roughness={0.3} />
            </mesh>
            {/* Flash Wok Cast Iron Ring */}
            <mesh position={[0, 0.05, 0]}>
              <torusGeometry args={[1.5, 0.08, 8, 32]} />
              <meshStandardMaterial color="#211e1c" metalness={0.8} roughness={0.3} />
            </mesh>
          </>
        ) : (
          <>
            {/* Faceted Crystal Botanical Rocks Tumbler */}
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.88, 0.78, 1.6, 8]} />
              <meshPhysicalMaterial
                color="#e58f4a"
                transmission={0.85}
                roughness={0.1}
                thickness={1.8}
                ior={1.52}
                clearcoat={1.0}
              />
            </mesh>
            {/* Carved Ice Prism inside */}
            <mesh position={[0, 0.6, 0]} rotation={[0.3, 0.4, 0]}>
              <boxGeometry args={[0.7, 0.7, 0.7]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.92}
                roughness={0.05}
                ior={1.31}
              />
            </mesh>
            {/* Pine & Cedar sprig */}
            <mesh position={[0.4, 1.25, 0]} rotation={[0.2, 0, 0.3]}>
              <coneGeometry args={[0.14, 0.8, 8]} />
              <meshStandardMaterial color="#2f663d" roughness={0.7} />
            </mesh>
          </>
        )}
      </group>

      {/* 3. Hot Herbal Steam (Smooth Round Puffs) */}
      <points ref={steamRef} position={[0, 0.8, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.24}
          map={steamTexture}
          color={isLight ? '#6e6457' : '#f4f0e8'}
          transparent
          opacity={0.35}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 4. Orbiting Botanicals & Embers */}
      <group ref={orbitRef} position={[0, 0.6, 0]}>
        <mesh position={[3.2, 0.3, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#2d2420" roughness={0.9} />
        </mesh>
        <mesh position={[-2.8, -0.4, 1.8]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#3a2e28" roughness={0.9} />
        </mesh>
        <mesh position={[2.2, -0.2, -2.4]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#e0531b" />
        </mesh>
        <mesh position={[-2.0, 0.7, -1.8]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshBasicMaterial color="#d9642a" />
        </mesh>
        <mesh position={[1.6, 0.9, 2.5]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#2b3a4a" roughness={0.4} />
        </mesh>
      </group>

      {/* Warm Uplight on the Plate */}
      <pointLight
        position={[0, 0.6, 0]}
        color="#d9642a"
        intensity={2.2}
        distance={8}
        decay={2}
      />
    </group>
  );
}
