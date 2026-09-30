import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface EmergingCulinaryArtifactProps {
  scrollProgress: number;
  heroProgress?: number;
  theme?: 'dark' | 'light';
  activeDishCategory?: 'nepali' | 'indochinese' | 'botanical';
}

/* =========================================================================
   1. AUTHENTIC HAND-FOLDED HIMALAYAN MOMO GEOMETRY
   Generates a plump, tender steamed dumpling with:
   - Flattened base where it rested in the bamboo/copper steamer
   - Generous swelling belly full of wild morel & yak butter filling
   - 18 spiral thumb-crimped pleats spiraling inward
   - Pinched hand-twisted rosette crown (potli knot) with central dimple
   ========================================================================= */
function createAuthenticMomoGeometry(): THREE.BufferGeometry {
  const radialSegments = 72;
  const heightSegments = 52;
  const numPleats = 18;

  const geo = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= heightSegments; j++) {
    const v = j / heightSegments;
    let y = -0.38 + v * 1.62;

    let r = 0;
    if (v < 0.08) {
      const baseT = v / 0.08;
      r = 1.18 * Math.sqrt(Math.max(0.01, baseT));
      y = -0.38 + Math.pow(baseT, 2) * 0.07;
    } else if (v < 0.44) {
      const bellyT = (v - 0.08) / 0.36;
      r = 1.18 + Math.sin(bellyT * Math.PI) * 0.52;
      y = -0.31 + bellyT * 0.52;
    } else if (v < 0.86) {
      const shoulderT = (v - 0.44) / 0.42;
      r = 1.52 * (1 - shoulderT * 0.68);
      y = 0.21 + shoulderT * 0.74;
    } else {
      const crownT = (v - 0.86) / 0.14;
      r = 0.48 * (1 - crownT * 0.55) + Math.sin(crownT * Math.PI) * 0.08;
      y = 0.95 + crownT * 0.26 - Math.pow(crownT, 3) * 0.08;
    }

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const angle = u * Math.PI * 2;

      let pleatAmp = 0;
      if (v > 0.18 && v <= 0.88) {
        const pleatEnvelope = Math.sin(((v - 0.18) / 0.70) * Math.PI);
        const spiralAngle = (angle + (v - 0.18) * 0.72) * numPleats;
        const fold = Math.sin(spiralAngle) + 0.38 * Math.sin(spiralAngle * 2 + 0.5);
        pleatAmp = fold * 0.13 * pleatEnvelope;
      } else if (v > 0.88) {
        const twistAngle = (angle + v * 2.8) * (numPleats * 0.5);
        pleatAmp = Math.sin(twistAngle) * 0.06 * (1 - (v - 0.88) / 0.12);
      }

      const doughNoise =
        Math.sin(angle * 7 + v * 12) * 0.014 +
        Math.cos(angle * 13 - v * 8) * 0.008;

      const finalR = Math.max(0.02, r * (1 + pleatAmp) + doughNoise);
      const x = Math.cos(angle) * finalR;
      const z = Math.sin(angle) * finalR;

      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  for (let j = 0; j < heightSegments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = j * (radialSegments + 1) + i;
      const b = a + radialSegments + 1;
      const c = a + 1;
      const d = b + 1;

      indices.push(a, b, c);
      indices.push(c, b, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/* =========================================================================
   2. SHAVED BLACK WINTER TRUFFLE CARPACCIO SLICE
   ========================================================================= */
function createTruffleSliceGeometry(radius = 0.32): THREE.BufferGeometry {
  const geo = new THREE.CircleGeometry(radius, 24);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = Math.sin(x * 6 + y * 4) * 0.04 - (x * x + y * y) * 0.08;
    pos.setZ(i, z);
    pos.setX(i, x * 1.18);
  }
  geo.computeVertexNormals();
  return geo;
}

/* =========================================================================
   3. SEATING TANGRA WOK TIGER PRAWN GEOMETRY (Clean, succulent curved shell)
   ========================================================================= */
function createAuthenticPrawnGeometry(): THREE.BufferGeometry {
  const segments = 48;
  const radial = 18;

  const spinePoints: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const arcAngle = t * Math.PI * 1.35 - 0.25;
    const r = 0.95 - t * 0.35;
    const x = Math.cos(arcAngle) * r;
    const y = Math.sin(arcAngle) * r * 0.85 + 0.15;
    const z = Math.sin(t * Math.PI) * 0.18;
    spinePoints.push(new THREE.Vector3(x, y, z));
  }
  const spine = new THREE.CatmullRomCurve3(spinePoints);

  const geo = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = spine.getPointAt(t);
    const tangent = spine.getTangentAt(t);

    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    if (normal.lengthSq() < 0.001) normal.set(1, 0, 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

    let radius = 0.44 * (1 - t * 0.65);
    const somiteBump = Math.sin(t * Math.PI * 10) * 0.035 * (1 - t * 0.4);
    radius += Math.max(0, somiteBump);

    for (let j = 0; j <= radial; j++) {
      const u = j / radial;
      const angle = u * Math.PI * 2;

      const rx = Math.cos(angle) * radius * 0.88;
      const ry = Math.sin(angle) * radius * 1.15;

      const px = point.x + normal.x * rx + binormal.x * ry;
      const py = point.y + normal.y * rx + binormal.y * ry;
      const pz = point.z + normal.z * rx + binormal.z * ry;

      positions.push(px, py, pz);
      uvs.push(u, t);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      const c = a + 1;
      const d = b + 1;

      indices.push(a, b, c);
      indices.push(c, b, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/* =========================================================================
   4. HAND-CARVED ARTISANAL ICE ROCK GEOMETRY
   ========================================================================= */
function createCarvedIceGeometry(size = 0.82): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(size, size, size, 4, 4, 4);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z);
    const disp = (Math.sin(x * 12) + Math.cos(y * 10) + Math.sin(z * 14)) * 0.022;
    const factor = 1 - (len / (size * 0.86)) * 0.06 + disp;
    pos.setXYZ(i, x * factor, y * factor, z * factor);
  }
  geo.computeVertexNormals();
  return geo;
}

export function EmergingCulinaryArtifact({
  heroProgress = 0,
  theme = 'light',
  activeDishCategory = 'nepali',
}: EmergingCulinaryArtifactProps) {
  const groupRef = useRef<THREE.Group>(null);
  const plateRef = useRef<THREE.Mesh>(null);
  const flameRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Points>(null);
  const auraRef = useRef<THREE.Points>(null);
  const embersRef = useRef<THREE.Points>(null);
  const fireLightRef = useRef<THREE.PointLight>(null);

  const isLight = theme === 'light';

  // Procedural Geometries
  const momoGeometry = useMemo(() => createAuthenticMomoGeometry(), []);
  const truffleSliceGeo1 = useMemo(() => createTruffleSliceGeometry(0.34), []);
  const truffleSliceGeo2 = useMemo(() => createTruffleSliceGeometry(0.28), []);
  const truffleSliceGeo3 = useMemo(() => createTruffleSliceGeometry(0.25), []);
  const prawnGeometry = useMemo(() => createAuthenticPrawnGeometry(), []);
  const iceGeometry = useMemo(() => createCarvedIceGeometry(0.82), []);

  // 1. Procedural Licking Flame Tongue Particles (Tapered, buoyant, dancing upward)
  const [flamePositions, flameVelocities, flameInitialAngles] = useMemo(() => {
    const count = 95;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const meta = new Float32Array(count * 2); // [radius, angle]

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.2) * 0.68;
      meta[i * 2] = r;
      meta[i * 2 + 1] = angle;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 0.18 + Math.random() * 2.2;
      pos[i * 3 + 2] = Math.sin(angle) * r * 0.7 - 0.28; // Nestles gracefully behind the food

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = 0.022 + Math.random() * 0.026;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [pos, vel, meta];
  }, []);

  // 2. Incandescent White-Gold Flame Core (Hot, concentrated at hearth base)
  const [corePositions, coreVelocities] = useMemo(() => {
    const count = 28;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.36;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 0.15 + Math.random() * 0.85;
      pos[i * 3 + 2] = Math.sin(angle) * r * 0.6 - 0.24;

      vel[i * 3] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = 0.016 + Math.random() * 0.022;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }
    return [pos, vel];
  }, []);

  // 3. Ethereal Ambient Heat Aura (Soft, airy, semi-transparent warm glow)
  const [auraPositions, auraVelocities] = useMemo(() => {
    const count = 16;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.6;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 0.3 + Math.random() * 1.8;
      pos[i * 3 + 2] = Math.sin(angle) * r * 0.6 - 0.28;

      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = 0.012 + Math.random() * 0.015;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return [pos, vel];
  }, []);

  // 4. Weightless High-Altitude Golden Embers & Sparks
  const [emberPositions, emberVelocities] = useMemo(() => {
    const count = 65;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.95;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 0.2 + Math.random() * 3.4;
      pos[i * 3 + 2] = Math.sin(angle) * r * 0.8 - 0.22;

      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = 0.018 + Math.random() * 0.032;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    return [pos, vel];
  }, []);

  // Authentic Teardrop Licking Flame Tongue Texture
  const flameTongueTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const cx = size / 2;
      const cy = size / 2;

      // 1. Outer delicate flame body with bezier teardrop contours
      const flameGrad = ctx.createRadialGradient(cx, cy * 1.25, 4, cx, cy * 0.95, size * 0.5);
      flameGrad.addColorStop(0.0, 'rgba(255, 255, 235, 1.0)'); // Incandescent core
      flameGrad.addColorStop(0.18, 'rgba(255, 220, 80, 0.94)'); // Radiant gold
      flameGrad.addColorStop(0.42, 'rgba(255, 145, 30, 0.78)'); // Warm amber
      flameGrad.addColorStop(0.72, 'rgba(245, 75, 18, 0.36)');  // Translucent apricot wisp
      flameGrad.addColorStop(1.0, 'rgba(210, 40, 10, 0.0)');   // Feathered dissipation

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(cx, size * 0.88);
      // Left curved belly
      ctx.bezierCurveTo(size * 0.22, size * 0.88, size * 0.22, size * 0.56, size * 0.38, size * 0.38);
      // Left taper into dancing crest tip
      ctx.bezierCurveTo(size * 0.44, size * 0.26, size * 0.46, size * 0.14, cx + 1, size * 0.08);
      // Right taper from crest tip
      ctx.bezierCurveTo(size * 0.52, size * 0.16, size * 0.56, size * 0.28, size * 0.62, size * 0.38);
      // Right curved belly
      ctx.bezierCurveTo(size * 0.78, size * 0.56, size * 0.78, size * 0.88, cx, size * 0.88);
      ctx.closePath();
      ctx.fill();

      // 2. Inner luminous white-gold heart
      const coreGrad = ctx.createRadialGradient(cx, size * 0.68, 2, cx, size * 0.62, size * 0.26);
      coreGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
      coreGrad.addColorStop(0.35, 'rgba(255, 245, 165, 0.82)');
      coreGrad.addColorStop(0.75, 'rgba(255, 185, 45, 0.30)');
      coreGrad.addColorStop(1.0, 'rgba(255, 130, 20, 0.0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.moveTo(cx, size * 0.82);
      ctx.bezierCurveTo(size * 0.35, size * 0.82, size * 0.36, size * 0.58, cx, size * 0.30);
      ctx.bezierCurveTo(size * 0.64, size * 0.58, size * 0.65, size * 0.82, cx, size * 0.82);
      ctx.closePath();
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Incandescent White-Gold Core Texture
  const flameCoreTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const cx = size / 2;
      const cy = size / 2;
      const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, size * 0.46);
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.25, 'rgba(255, 248, 180, 0.92)');
      grad.addColorStop(0.60, 'rgba(255, 195, 60, 0.45)');
      grad.addColorStop(1.0, 'rgba(255, 130, 20, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Ultra-Soft Ethereal Heat Aura Texture
  const flameAuraTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const cx = size / 2;
      const cy = size / 2;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, size * 0.48);
      grad.addColorStop(0.0, 'rgba(255, 190, 80, 0.55)');
      grad.addColorStop(0.38, 'rgba(255, 130, 30, 0.28)');
      grad.addColorStop(0.72, 'rgba(235, 65, 15, 0.10)');
      grad.addColorStop(1.0, 'rgba(180, 30, 10, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
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
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center * 0.44);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.25, 'rgba(255, 235, 130, 0.9)');
      gradient.addColorStop(0.65, 'rgba(255, 150, 30, 0.45)');
      gradient.addColorStop(1, 'rgba(220, 50, 10, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, center * 0.44, 0, Math.PI * 2);
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
      scale = THREE.MathUtils.lerp(0.05, 0.58, smoothP);
    } else if (heroProgress < 0.75) {
      // Primary Hero stage: Centered, floating smoothly
      posY = -0.55 + Math.sin(t * 1.3) * 0.07;
      posZ = 9.2;
      scale = 0.58;
    } else if (heroProgress < 0.92) {
      const p = (heroProgress - 0.75) / 0.17;
      posY = THREE.MathUtils.lerp(-0.55, -4.5, p);
      posZ = THREE.MathUtils.lerp(9.2, 4.0, p);
      scale = THREE.MathUtils.lerp(0.58, 0.0, p);
    } else {
      scale = 0;
    }

    // Interactive 3D position & mouse tilt
    groupRef.current.position.set(
      pointer.x * 0.45,
      posY + pointer.y * 0.15,
      posZ
    );
    groupRef.current.scale.setScalar(scale);

    // Continuous 3D rotation with mouse reaction
    groupRef.current.rotation.y = t * 0.30 + pointer.x * 0.65;
    groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.06 - pointer.y * 0.22;

    // Dynamic Hearth Fire Respiration & Flicker
    if (fireLightRef.current) {
      const flicker =
        Math.sin(t * 14) * 0.35 +
        Math.sin(t * 26) * 0.22 +
        (Math.random() - 0.5) * 0.18;
      fireLightRef.current.intensity = (isLight ? 2.9 : 2.7) + flicker;
    }

    // 1. Realistic Flame Tongues Physics (Buoyancy + Flue Inward Pinch + Laminar Sway)
    if (flameRef.current && scale > 0.2) {
      const posAttr = flameRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 95; i++) {
        const curY = posArr[i * 3 + 1];
        // Buoyant upward acceleration: moves faster as it heats up
        const speedY = flameVelocities[i * 3 + 1] * (1.0 + Math.max(0, curY - 0.2) * 0.38);
        posArr[i * 3 + 1] += speedY;

        // Inward pinch toward center axis as flames rise (authentic conical campfire silhouette)
        const baseR = flameInitialAngles[i * 2];
        const baseAngle = flameInitialAngles[i * 2 + 1];
        const pinch = Math.max(0.18, 1.0 - (curY / 2.7) * 0.68);

        // Fluid organic licking wave
        const waveX = Math.sin(t * 7.5 + curY * 3.8 + i * 0.65) * 0.007 + Math.sin(t * 15.0 + i * 2.1) * 0.0025;
        const waveZ = Math.cos(t * 6.5 + curY * 3.4 + i * 0.5) * 0.005;

        posArr[i * 3] = Math.cos(baseAngle) * baseR * pinch + waveX;
        posArr[i * 3 + 2] = Math.sin(baseAngle) * baseR * pinch * 0.7 - 0.28 + waveZ;

        if (posArr[i * 3 + 1] > 2.5 + (i % 6) * 0.12) {
          flameInitialAngles[i * 2 + 1] = Math.random() * Math.PI * 2;
          flameInitialAngles[i * 2] = Math.pow(Math.random(), 1.2) * 0.68;
          posArr[i * 3 + 1] = 0.15 + Math.random() * 0.18;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 2. Incandescent White-Gold Core Physics (Intense, low-lying, fast flicker)
    if (coreRef.current && scale > 0.2) {
      const posAttr = coreRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 28; i++) {
        posArr[i * 3 + 1] += coreVelocities[i * 3 + 1];
        posArr[i * 3] += Math.sin(t * 12 + i * 1.5) * 0.003;
        posArr[i * 3 + 2] += Math.cos(t * 11 + i * 1.2) * 0.003;

        if (posArr[i * 3 + 1] > 0.95 + (i % 4) * 0.1) {
          posArr[i * 3 + 1] = 0.15 + Math.random() * 0.12;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 3. Ethereal Ambient Heat Aura Physics (Slow, weightless expansion)
    if (auraRef.current && scale > 0.2) {
      const posAttr = auraRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 16; i++) {
        posArr[i * 3 + 1] += auraVelocities[i * 3 + 1];
        posArr[i * 3] += Math.sin(t * 3.5 + i) * 0.004;
        posArr[i * 3 + 2] += Math.cos(t * 3.0 + i) * 0.004;

        if (posArr[i * 3 + 1] > 2.2) {
          posArr[i * 3 + 1] = 0.25 + Math.random() * 0.2;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 4. Weightless Embers Physics
    if (embersRef.current && scale > 0.2) {
      const posAttr = embersRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 65; i++) {
        posArr[i * 3 + 1] += emberVelocities[i * 3 + 1];
        posArr[i * 3] += emberVelocities[i * 3] + Math.sin(t * 3.8 + i) * 0.006;
        posArr[i * 3 + 2] += emberVelocities[i * 3 + 2] + Math.cos(t * 3.2 + i) * 0.006;

        if (posArr[i * 3 + 1] > 3.8) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.8;
          posArr[i * 3] = Math.cos(angle) * r;
          posArr[i * 3 + 1] = 0.2 + Math.random() * 0.18;
          posArr[i * 3 + 2] = Math.sin(angle) * r * 0.8 - 0.22;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} visible={heroProgress > 0.12 && heroProgress < 0.92}>
      {/* 1. Volcanic Basalt Slate Platter Base */}
      <mesh ref={plateRef} position={[0, -0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.7, 2.5, 0.22, 54]} />
        <meshStandardMaterial
          color={isLight ? '#32373e' : '#14181c'}
          roughness={0.72}
          metalness={0.28}
          flatShading
        />
      </mesh>

      {/* Hand-hammered Himalayan Brass Rim Inlay (Flat on the slate) */}
      <mesh position={[0, -0.30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.36, 54]} />
        <meshStandardMaterial
          color="#d9642a"
          roughness={0.25}
          metalness={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. THE 3D CULINARY ARTIFACT FOR EACH DIALECT */}
      <group position={[0, 0.1, 0]}>
        {activeDishCategory === 'nepali' ? (
          <>
            {/* DISH 1: Authentic Hand-Folded Morel Momo */}
            <mesh geometry={momoGeometry} position={[0.2, 0, -0.1]} castShadow receiveShadow>
              <meshPhysicalMaterial
                color={isLight ? '#faf5ea' : '#f4edd9'}
                roughness={0.34}
                transmission={0.28}
                thickness={1.25}
                ior={1.46}
                reflectivity={0.6}
                clearcoat={0.7}
                clearcoatRoughness={0.26}
              />
            </mesh>

            {/* Shaved Black Winter Truffle Carpaccio Slices */}
            <mesh
              geometry={truffleSliceGeo1}
              position={[0.48, 0.95, 0.25]}
              rotation={[-0.45, 0.35, 0.2]}
            >
              <meshStandardMaterial color="#1c1613" roughness={0.75} metalness={0.1} />
            </mesh>
            <mesh
              geometry={truffleSliceGeo2}
              position={[-0.12, 1.02, 0.15]}
              rotation={[-0.3, -0.4, -0.15]}
            >
              <meshStandardMaterial color="#1a1411" roughness={0.75} metalness={0.1} />
            </mesh>
            <mesh
              geometry={truffleSliceGeo3}
              position={[0.25, 1.15, -0.32]}
              rotation={[0.4, 0.2, -0.3]}
            >
              <meshStandardMaterial color="#1e1814" roughness={0.75} metalness={0.1} />
            </mesh>

            {/* Micro Chive Herb Batons */}
            <mesh position={[0.22, 1.28, -0.05]} rotation={[0.2, 0.6, 0.4]}>
              <cylinderGeometry args={[0.018, 0.018, 0.45, 8]} />
              <meshStandardMaterial color="#3b7f46" roughness={0.4} />
            </mesh>
            <mesh position={[0.28, 1.26, 0.08]} rotation={[-0.3, -0.5, 0.2]}>
              <cylinderGeometry args={[0.016, 0.016, 0.42, 8]} />
              <meshStandardMaterial color="#478d52" roughness={0.4} />
            </mesh>

            {/* Crushed Red Timur Pepper Dusting atop Crown */}
            <mesh position={[0.18, 1.25, 0.02]}>
              <dodecahedronGeometry args={[0.038, 0]} />
              <meshStandardMaterial color="#942a1d" roughness={0.6} />
            </mesh>
            <mesh position={[0.26, 1.24, -0.08]}>
              <dodecahedronGeometry args={[0.032, 0]} />
              <meshStandardMaterial color="#ba3e26" roughness={0.6} />
            </mesh>

            {/* Ceramic Dipping Ramekin of Dipping Achar */}
            <mesh position={[-1.35, -0.18, 0.75]} castShadow receiveShadow>
              <cylinderGeometry args={[0.74, 0.64, 0.18, 36]} />
              <meshStandardMaterial color="#1a1c1e" roughness={0.55} metalness={0.4} />
            </mesh>
            <mesh position={[-1.35, -0.08, 0.75]}>
              <cylinderGeometry args={[0.67, 0.67, 0.02, 36]} />
              <meshPhysicalMaterial
                color="#c43e18"
                transmission={0.22}
                roughness={0.08}
                clearcoat={1.0}
                ior={1.42}
              />
            </mesh>
            {/* Sesame garnish */}
            <mesh position={[-1.28, -0.065, 0.72]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial color="#f0dcb8" roughness={0.5} />
            </mesh>
            <mesh position={[-1.42, -0.065, 0.8]}>
              <sphereGeometry args={[0.022, 6, 6]} />
              <meshStandardMaterial color="#f0dcb8" roughness={0.5} />
            </mesh>
          </>
        ) : activeDishCategory === 'indochinese' ? (
          <>
            {/* DISH 2: Wok-Seared Tiger Prawn on Cast Iron Skillet */}
            <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[2.0, 1.85, 0.14, 42]} />
              <meshStandardMaterial color="#1a1816" roughness={0.7} metalness={0.75} />
            </mesh>
            {/* Sizzling Dark Chili Garlic Sauce Well */}
            <mesh position={[0, -0.14, 0]}>
              <cylinderGeometry args={[1.75, 1.75, 0.02, 36]} />
              <meshPhysicalMaterial
                color="#94260e"
                roughness={0.15}
                clearcoat={0.9}
                transmission={0.25}
              />
            </mesh>

            {/* Curved Succulent Tiger Prawn */}
            <mesh geometry={prawnGeometry} position={[0, 0.35, 0]} castShadow>
              <meshPhysicalMaterial
                color="#e55524"
                roughness={0.28}
                clearcoat={0.88}
                clearcoatRoughness={0.18}
                transmission={0.12}
                thickness={1.1}
                ior={1.48}
              />
            </mesh>

            {/* Tail Fan (Uropod Fins) */}
            <group position={[0.62, 0.96, 0.08]} rotation={[0.4, 0.2, -0.3]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.32, 0.03, 0.16]} />
                <meshStandardMaterial color="#d4451c" roughness={0.4} />
              </mesh>
              <mesh position={[0.08, 0.02, 0.12]} rotation={[0, 0.45, 0]}>
                <boxGeometry args={[0.28, 0.025, 0.14]} />
                <meshStandardMaterial color="#dc5424" roughness={0.4} />
              </mesh>
              <mesh position={[0.08, -0.02, -0.12]} rotation={[0, -0.45, 0]}>
                <boxGeometry args={[0.28, 0.025, 0.14]} />
                <meshStandardMaterial color="#dc5424" roughness={0.4} />
              </mesh>
            </group>

            {/* Curled Jade Spring Onion Scallion Ribbons */}
            <mesh position={[-0.1, 0.9, 0.25]} rotation={[0.6, 0.4, -0.5]}>
              <torusGeometry args={[0.24, 0.028, 8, 24, Math.PI * 1.4]} />
              <meshStandardMaterial color="#42894d" roughness={0.35} />
            </mesh>
            <mesh position={[0.25, 0.75, 0.28]} rotation={[-0.4, 0.7, 0.3]}>
              <torusGeometry args={[0.2, 0.024, 8, 24, Math.PI * 1.6]} />
              <meshStandardMaterial color="#4ea05c" roughness={0.35} />
            </mesh>

            {/* Crispy Fried Golden Garlic Flakes */}
            <mesh position={[-0.25, 0.65, 0.32]} rotation={[0.3, 0.2, 0.8]}>
              <boxGeometry args={[0.18, 0.02, 0.14]} />
              <meshStandardMaterial color="#dcb26c" roughness={0.45} />
            </mesh>
            <mesh position={[0.05, 0.85, -0.22]} rotation={[-0.5, 0.3, 0.4]}>
              <boxGeometry args={[0.16, 0.02, 0.12]} />
              <meshStandardMaterial color="#e0b874" roughness={0.45} />
            </mesh>

            {/* Sliced Red Birds-Eye Chili Ring */}
            <mesh position={[0.32, 0.48, 0.3]} rotation={[0.7, -0.3, 0.5]}>
              <torusGeometry args={[0.12, 0.035, 8, 20]} />
              <meshStandardMaterial color="#bd2518" roughness={0.25} />
            </mesh>
          </>
        ) : (
          <>
            {/* DISH 3: Transparent Crystal Rocks Glass Tumbler */}
            <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.02, 0.94, 0.3, 32]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.96}
                roughness={0.03}
                ior={1.54}
                thickness={2.2}
                clearcoat={1.0}
              />
            </mesh>

            {/* Transparent Crystal Glass Walls */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <cylinderGeometry args={[1.08, 1.0, 1.3, 32, 1, true]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.97}
                roughness={0.04}
                ior={1.54}
                thickness={1.6}
                clearcoat={1.0}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Warm Honey-Amber Liquid inside glass */}
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[0.94, 0.88, 1.0, 32]} />
              <meshPhysicalMaterial
                color="#d8741e"
                transmission={0.82}
                roughness={0.1}
                ior={1.38}
                clearcoat={0.9}
              />
            </mesh>

            {/* Submerged Clear Glacial Ice Rock */}
            <mesh
              geometry={iceGeometry}
              position={[0.04, 0.62, 0.02]}
              rotation={[0.25, 0.42, 0.18]}
            >
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.95}
                roughness={0.07}
                ior={1.31}
                reflectivity={0.7}
              />
            </mesh>

            {/* Dehydrated Blood Orange Wheel on Rim */}
            <group position={[-0.32, 0.88, 0.22]} rotation={[0.4, -0.6, 0.3]}>
              <mesh>
                <cylinderGeometry args={[0.48, 0.48, 0.04, 28]} />
                <meshStandardMaterial color="#ba4416" roughness={0.65} />
              </mesh>
              <mesh position={[0, 0.015, 0]}>
                <cylinderGeometry args={[0.42, 0.42, 0.035, 28]} />
                <meshPhysicalMaterial
                  color="#dc5c1e"
                  transmission={0.45}
                  roughness={0.3}
                  thickness={0.5}
                />
              </mesh>
            </group>

            {/* Charred Cinnamon Bark Quill */}
            <mesh position={[0.1, 0.95, 0.38]} rotation={[-0.35, 0.2, 0.6]}>
              <cylinderGeometry args={[0.045, 0.05, 0.72, 12, 1, true]} />
              <meshStandardMaterial color="#382115" roughness={0.85} />
            </mesh>
          </>
        )}
      </group>

      {/* 3. BLAZING HIMALAYAN HEARTH FIRE (Realistic, lighter, multi-layered) */}
      
      {/* Layer A: Ultra-soft Ethereal Ambient Heat Aura */}
      <points ref={auraRef} position={[0, 0.08, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[auraPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.78}
          map={flameAuraTexture}
          color={isLight ? '#ff9233' : '#ff7e1d'}
          transparent
          opacity={isLight ? 0.16 : 0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Layer B: Realistic Teardrop Licking Flame Tongues */}
      <points ref={flameRef} position={[0, 0.05, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[flamePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.36}
          map={flameTongueTexture}
          color={isLight ? '#ffa526' : '#ff8e1a'}
          transparent
          opacity={isLight ? 0.78 : 0.80}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Layer C: Incandescent White-Gold Thermal Core (Base Hearth Heart) */}
      <points ref={coreRef} position={[0, 0.06, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[corePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.20}
          map={flameCoreTexture}
          color="#fff4ab"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Layer D: Delicate High-Altitude Golden Embers & Sparks */}
      <points ref={embersRef} position={[0, 0.1, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[emberPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          map={sparkTexture}
          color={isLight ? '#ffb938' : '#ffd54f'}
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Layer E: Dynamic Flickering Sacred Firelight */}
      <pointLight
        ref={fireLightRef}
        position={[0, 0.5, 0.75]}
        color="#ff7822"
        intensity={2.8}
        distance={9}
        decay={2}
      />
    </group>
  );
}





