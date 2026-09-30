import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// 1. Creates a smooth circular particle texture with soft anti-aliased edges for background blizzard snow
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

// 2. Creates an authentic, intricate 6-sided crystalline dendritic snowflake texture (512x512 High-DPI)
function createDendriticSnowflakeTexture(isLight: boolean): THREE.Texture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.46;

  ctx.clearRect(0, 0, size, size);

  // Soft crystalline glow aura
  const aura = ctx.createRadialGradient(cx, cy, 4, cx, cy, maxR);
  if (isLight) {
    aura.addColorStop(0, 'rgba(220, 238, 252, 0.45)');
    aura.addColorStop(0.4, 'rgba(185, 218, 242, 0.20)');
    aura.addColorStop(0.8, 'rgba(165, 202, 232, 0.05)');
    aura.addColorStop(1, 'rgba(165, 202, 232, 0)');
  } else {
    aura.addColorStop(0, 'rgba(235, 248, 255, 0.60)');
    aura.addColorStop(0.35, 'rgba(180, 225, 255, 0.28)');
    aura.addColorStop(0.75, 'rgba(140, 205, 255, 0.08)');
    aura.addColorStop(1, 'rgba(140, 205, 255, 0)');
  }
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Palette definition based on theme
  const spineColor = isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 1.0)';
  const shadowColor = isLight ? 'rgba(50, 80, 110, 0.50)' : 'rgba(75, 135, 195, 0.35)';
  const facetColor = isLight ? 'rgba(190, 222, 248, 0.88)' : 'rgba(215, 240, 255, 0.88)';
  const coreFill = isLight ? 'rgba(215, 238, 255, 0.48)' : 'rgba(195, 232, 255, 0.42)';

  // 6 Symmetrical Dendritic Arms
  for (let b = 0; b < 6; b++) {
    const angle = (b * Math.PI) / 3;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Primary lateral branch definitions along the main arm
    const branches = [
      { pos: 0.24, len: 0.22, subSpines: 1 },
      { pos: 0.42, len: 0.42, subSpines: 3 },
      { pos: 0.60, len: 0.54, subSpines: 5 },
      { pos: 0.76, len: 0.40, subSpines: 4 },
      { pos: 0.88, len: 0.24, subSpines: 2 },
    ];

    const branchAngle = Math.PI / 3; // 60 deg

    // --- PASS 1: Contrast Shadow Outline (Makes fine needles pop in light and dark mode) ---
    if (isLight) {
      ctx.strokeStyle = shadowColor;
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxR, 0);
      ctx.stroke();

      branches.forEach(({ pos, len, subSpines }) => {
        const sx = maxR * pos;
        const bLen = maxR * len;
        for (const dir of [1, -1]) {
          const sAngle = dir * branchAngle;
          const ex = sx + Math.cos(sAngle) * bLen;
          const ey = Math.sin(sAngle) * bLen;
          ctx.beginPath();
          ctx.moveTo(sx, 0);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          for (let s = 1; s <= subSpines; s++) {
            const st = s / (subSpines + 1);
            const subX = sx + Math.cos(sAngle) * (bLen * st);
            const subY = Math.sin(sAngle) * (bLen * st);
            const subLen = bLen * 0.38 * (1 - st * 0.35);
            ctx.beginPath();
            ctx.moveTo(subX, subY);
            ctx.lineTo(subX + Math.cos(0) * subLen, subY + Math.sin(0) * subLen * dir);
            ctx.stroke();
          }
        }
      });
    }

    // --- PASS 2: Main Crystalline Body (Crisp Ice Spine & Branches) ---
    ctx.strokeStyle = spineColor;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(maxR, 0);
    ctx.stroke();

    branches.forEach(({ pos, len, subSpines }) => {
      const sx = maxR * pos;
      const bLen = maxR * len;

      for (const dir of [1, -1]) {
        const sAngle = dir * branchAngle;
        const ex = sx + Math.cos(sAngle) * bLen;
        const ey = Math.sin(sAngle) * bLen;

        // Side branch
        ctx.strokeStyle = spineColor;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Tertiary fern-like sub-needles
        for (let s = 1; s <= subSpines; s++) {
          const st = s / (subSpines + 1);
          const subX = sx + Math.cos(sAngle) * (bLen * st);
          const subY = Math.sin(sAngle) * (bLen * st);
          const subLen = bLen * 0.38 * (1 - st * 0.35);

          // Sub-needle branches at 60 deg relative to side branch (parallel to main spine)
          const needleAngle = sAngle - dir * branchAngle;
          const nex = subX + Math.cos(needleAngle) * subLen;
          const ney = subY + Math.sin(needleAngle) * subLen;

          ctx.strokeStyle = facetColor;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(subX, subY);
          ctx.lineTo(nex, ney);
          ctx.stroke();
        }
      }
    });

    // Arrowhead Tip Facet
    ctx.fillStyle = spineColor;
    ctx.beginPath();
    ctx.moveTo(maxR, 0);
    ctx.lineTo(maxR - 9, -4.5);
    ctx.lineTo(maxR - 18, 0);
    ctx.lineTo(maxR - 9, 4.5);
    ctx.closePath();
    ctx.fill();

    // Central ice rib highlight on main spine
    ctx.strokeStyle = facetColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(maxR * 0.94, 0);
    ctx.stroke();

    ctx.restore();
  }

  // --- PASS 3: Central Hexagonal Crystalline Core & Star Plate ---
  ctx.save();
  ctx.translate(cx, cy);

  // Outer hexagonal plate
  const hexR = maxR * 0.22;
  ctx.fillStyle = coreFill;
  ctx.strokeStyle = spineColor;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const x = Math.cos(a) * hexR;
    const y = Math.sin(a) * hexR;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Internal 12-point faceted star
  ctx.strokeStyle = facetColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const r = i % 2 === 0 ? hexR * 0.72 : hexR * 0.36;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Center sparkling diamond pip
  ctx.fillStyle = spineColor;
  ctx.beginPath();
  ctx.arc(0, 0, 3.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

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
  const crystalMeshRef = useRef<THREE.InstancedMesh>(null);
  const emberRef = useRef<THREE.Points>(null);

  const particleCount = 1400; // Background soft blizzard flurries
  const crystalCount = 260;   // Dainty 6-sided dendritic snowflake crystals
  const emberCount = 350;
  const isLight = theme === 'light';

  // Textures
  const circleTexture = useMemo(() => createCircleParticleTexture(0.55), []);
  const emberTexture = useMemo(() => createCircleParticleTexture(0.4), []);
  const snowflakeTextureLight = useMemo(() => createDendriticSnowflakeTexture(true), []);
  const snowflakeTextureDark = useMemo(() => createDendriticSnowflakeTexture(false), []);

  const activeSnowflakeTexture = isLight ? snowflakeTextureLight : snowflakeTextureDark;

  // 1. Background Circular Snow Flurries
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

  // 2. High-Definition 6-Sided Dendritic Snowflake Crystals (Small, dainty, and graceful)
  const crystalData = useMemo(() => {
    const data = [];
    for (let i = 0; i < crystalCount; i++) {
      data.push({
        x: (Math.random() - 0.5) * 60,
        y: Math.random() * 42 - 6,
        z: Math.random() * 38 + 5, // Strategically in camera frustum (Z=5 to Z=43)
        baseScale: Math.random() * 0.35 + 0.35, // Delicately sized (0.35 to 0.70 units)
        vy: -0.015 - Math.random() * 0.022,
        vx: (Math.random() - 0.5) * 0.012,
        vz: (Math.random() - 0.5) * 0.01,
        rotZ: Math.random() * Math.PI * 2,
        rotZSpeed: (Math.random() - 0.5) * 0.018, // In-plane crystal spin
        rotXSpeed: (Math.random() - 0.5) * 0.012,
        rotYSpeed: (Math.random() - 0.5) * 0.014,
        swayPhase: Math.random() * Math.PI * 2,
        swayFreq: 1.1 + Math.random() * 0.9,
      });
    }
    return data;
  }, [crystalCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 3. Hearth Embers
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
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 2.0;

    // 1. Animate Circular Snow Flurries
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

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

    // 2. Animate Intricate Dendritic Snowflake Crystals (Tumbling, fluttering, and spinning)
    if (crystalMeshRef.current) {
      for (let i = 0; i < crystalCount; i++) {
        const c = crystalData[i];

        // Gentle fall and alpine wind sway
        c.y += c.vy;
        const sway = Math.sin(t * c.swayFreq + c.swayPhase) * 0.009;
        c.x += c.vx + sway + mouseX * 0.004;
        c.z += c.vz;

        // In-plane spin and 3D fluttering tilt (catching mountain light)
        c.rotZ += c.rotZSpeed;
        const rotX = Math.sin(t * 1.6 + c.swayPhase) * 0.32;
        const rotY = Math.cos(t * 1.2 + c.swayPhase) * 0.32;

        // Boundary looping
        if (c.y < -7) {
          c.y = 38;
          c.x = (Math.random() - 0.5) * 55;
          c.z = Math.random() * 36 + 6;
        }
        if (c.x > 32) c.x = -32;
        if (c.x < -32) c.x = 32;

        dummy.position.set(c.x, c.y, c.z);
        dummy.rotation.set(rotX, rotY, c.rotZ);
        dummy.scale.setScalar(c.baseScale);
        dummy.updateMatrix();

        crystalMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      crystalMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Animate Embers (increasing opacity as we scroll down to hearth)
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
      {/* Layer 1: Background Alpine Snow Flurries (Smooth Round Circles) */}
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

      {/* Layer 2: Glistening 6-Sided Dendritic Snowflake Crystals (Fluttering & Tumbling) */}
      <instancedMesh
        ref={crystalMeshRef}
        args={[undefined, undefined, crystalCount]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={activeSnowflakeTexture}
          transparent
          opacity={isLight ? 0.92 : 0.96}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Layer 3: Culinary Hearth Embers (Smooth Round Sparks) */}
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
