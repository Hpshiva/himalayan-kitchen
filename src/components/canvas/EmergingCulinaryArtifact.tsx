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
  const radialSegments = 72; // High density for smooth, defined folds
  const heightSegments = 52;
  const numPleats = 18; // 18 authentic hand-folded pleats

  const geo = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= heightSegments; j++) {
    const v = j / heightSegments; // 0 (base) to 1 (crown)

    // Vertical profile from steamer base to pinched crest
    let y = -0.38 + v * 1.62;

    // Radius profile of an authentic plump steamed momo
    let r = 0;
    if (v < 0.08) {
      // Steamer contact base: gently flattened
      const baseT = v / 0.08;
      r = 1.18 * Math.sqrt(Math.max(0.01, baseT));
      y = -0.38 + Math.pow(baseT, 2) * 0.07;
    } else if (v < 0.44) {
      // Plump lower belly bulging with hearty filling
      const bellyT = (v - 0.08) / 0.36;
      r = 1.18 + Math.sin(bellyT * Math.PI) * 0.52; // Max radius ~1.70
      y = -0.31 + bellyT * 0.52;
    } else if (v < 0.86) {
      // Inward-tapering pleated shoulder
      const shoulderT = (v - 0.44) / 0.42;
      r = 1.52 * (1 - shoulderT * 0.68); // Tapers down toward crown
      y = 0.21 + shoulderT * 0.74;
    } else {
      // Pinched hand-twisted crown rosette (potli knot)
      const crownT = (v - 0.86) / 0.14;
      // Flared pinched dough edges with delicate dimple at apex
      r = 0.48 * (1 - crownT * 0.55) + Math.sin(crownT * Math.PI) * 0.08;
      y = 0.95 + crownT * 0.26 - Math.pow(crownT, 3) * 0.08;
    }

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const angle = u * Math.PI * 2;

      // Authentic hand-pleated dough displacement
      let pleatAmp = 0;
      if (v > 0.18 && v <= 0.88) {
        // Shoulder pleats: asymmetric fold with sharp crease and smooth crest
        const pleatEnvelope = Math.sin(((v - 0.18) / 0.70) * Math.PI);
        const spiralAngle = (angle + (v - 0.18) * 0.72) * numPleats;
        // Asymmetric thumb-pinch profile
        const fold = Math.sin(spiralAngle) + 0.38 * Math.sin(spiralAngle * 2 + 0.5);
        pleatAmp = fold * 0.13 * pleatEnvelope;
      } else if (v > 0.88) {
        // Tight hand-twisted spiral knot at the summit
        const twistAngle = (angle + v * 2.8) * (numPleats * 0.5);
        pleatAmp = Math.sin(twistAngle) * 0.06 * (1 - (v - 0.88) / 0.12);
      }

      // Natural micro-irregularities of handmade rolled flour dough
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
   Generates a delicate, organically curved paper-thin truffle shaving.
   ========================================================================= */
function createTruffleSliceGeometry(radius = 0.32): THREE.BufferGeometry {
  const geo = new THREE.CircleGeometry(radius, 24);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Subtle organic curl so it drapes over the dumpling folds
    const z = Math.sin(x * 6 + y * 4) * 0.04 - (x * x + y * y) * 0.08;
    pos.setZ(i, z);
    // Slight oval deformation
    pos.setX(i, x * 1.18);
  }
  geo.computeVertexNormals();
  return geo;
}

/* =========================================================================
   3. SEATING TANGRA WOK TIGER PRAWN GEOMETRY
   Generates an authentic crescent tiger prawn with:
   - Curved 6-segment carapace with overlapping shell somites
   - Succulent inner meat curve
   - Fan-shaped tail uropod fins
   - Wok-blistered char ridges
   ========================================================================= */
function createAuthenticPrawnGeometry(): THREE.BufferGeometry {
  const segments = 48;
  const radial = 18;

  // Generate 3D Catmull-Rom spine curve for a natural "C" curled prawn
  const spinePoints: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 (thick head base) to 1 (tail fin)
    const arcAngle = t * Math.PI * 1.35 - 0.25; // ~240° arch
    const r = 0.95 - t * 0.35; // gentle inward spiral
    const x = Math.cos(arcAngle) * r;
    const y = Math.sin(arcAngle) * r * 0.85 + 0.15;
    // Subtle S-curve 3D body twist
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

    // Compute coordinate frame along curve
    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    if (normal.lengthSq() < 0.001) normal.set(1, 0, 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

    // Radius profile: thick head tapering down to slender tail
    let radius = 0.44 * (1 - t * 0.65);
    // 6 overlapping carapace somite ridges
    const somiteBump = Math.sin(t * Math.PI * 10) * 0.035 * (1 - t * 0.4);
    radius += Math.max(0, somiteBump);

    for (let j = 0; j <= radial; j++) {
      const u = j / radial;
      const angle = u * Math.PI * 2;

      // Prawn cross-section: taller dorsoventrally than wide
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
   Generates a clear beveled, chiseled crystal ice cube with organic faceting.
   ========================================================================= */
function createCarvedIceGeometry(size = 0.84): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(size, size, size, 4, 4, 4);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Soft beveling and organic chiseled hand-cut displacement
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
  const steamRef = useRef<THREE.Points>(null);

  const isLight = theme === 'light';

  // Memoized authentic procedural geometries
  const momoGeometry = useMemo(() => createAuthenticMomoGeometry(), []);
  const truffleSliceGeo1 = useMemo(() => createTruffleSliceGeometry(0.34), []);
  const truffleSliceGeo2 = useMemo(() => createTruffleSliceGeometry(0.28), []);
  const truffleSliceGeo3 = useMemo(() => createTruffleSliceGeometry(0.25), []);
  const prawnGeometry = useMemo(() => createAuthenticPrawnGeometry(), []);
  const iceGeometry = useMemo(() => createCarvedIceGeometry(0.82), []);

  // Hot rising botanical steam particles (rising smoothly from hot food)
  const [steamPositions, steamVelocities] = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.1;
      pos[i * 3 + 1] = 0.4 + Math.random() * 2.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.1;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = 0.018 + Math.random() * 0.024;
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
      posY = THREE.MathUtils.lerp(-12, -0.55, smoothP);
      posZ = THREE.MathUtils.lerp(3, 9.2, smoothP);
      scale = THREE.MathUtils.lerp(0.05, 0.58, smoothP);
    } else if (heroProgress < 0.72) {
      // Primary Hero stage: Perfectly centered between top header and lower actions
      posY = -0.55 + Math.sin(t * 1.4) * 0.08;
      posZ = 9.2;
      scale = 0.58;
    } else if (heroProgress < 0.90) {
      // Lowering into table
      const p = (heroProgress - 0.72) / 0.18;
      posY = THREE.MathUtils.lerp(-0.55, -4.5, p);
      posZ = THREE.MathUtils.lerp(9.2, 4.0, p);
      scale = THREE.MathUtils.lerp(0.58, 0.0, p);
    } else {
      scale = 0;
    }

    // Apply interactive 3D position & subtle mouse tilt (centered on both axes)
    groupRef.current.position.set(
      pointer.x * 0.45,
      posY + pointer.y * 0.15,
      posZ
    );
    groupRef.current.scale.setScalar(scale);

    // Continuous smooth 3D rotation with mouse reaction
    groupRef.current.rotation.y = t * 0.28 + pointer.x * 0.55;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.05 - pointer.y * 0.22;

    // Steam simulation
    if (steamRef.current && scale > 0.2) {
      const posAttr = steamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < 120; i++) {
        posArr[i * 3 + 1] += steamVelocities[i * 3 + 1];
        posArr[i * 3] += steamVelocities[i * 3] + Math.sin(t * 2 + i) * 0.002;
        posArr[i * 3 + 2] += steamVelocities[i * 3 + 2];

        if (posArr[i * 3 + 1] > 2.8) {
          posArr[i * 3 + 1] = 0.4;
          posArr[i * 3] = (Math.random() - 0.5) * 0.8;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
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
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.32)');
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

      {/* Hand-hammered Himalayan Brass Rim Inlay (Laid perfectly flat on the slate) */}
      <mesh position={[0, -0.30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.36, 54]} />
        <meshStandardMaterial
          color="#d9642a"
          roughness={0.25}
          metalness={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Primary Michelin Culinary Centerpiece */}
      <group position={[0, 0.1, 0]}>
        {activeDishCategory === 'nepali' ? (
          <>
            {/* -------------------------------------------------------------
                DISH 1: WILD MOREL & TRUFFLE MOMO
                Authentic 18-pleated hand-folded dumpling with:
                - Steamed translucent dough with tender moisture sheen
                - Shaved black winter truffle carpaccio
                - Micro-chive / Himalayan herb slivers
                - Roasted red Timur pepper specks
                - Accompanied by a black ceramic dish of fiery chili-sesame achar
               ------------------------------------------------------------- */}
            {/* Main Hand-Pleated Momo */}
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

            {/* Delicate Fresh Herb / Chive Batons crossing the crown */}
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
            <mesh position={[0.14, 1.23, 0.12]}>
              <dodecahedronGeometry args={[0.028, 0]} />
              <meshStandardMaterial color="#882218" roughness={0.6} />
            </mesh>

            {/* Black Ceramic Tasting Ramekin of Dipping Achar */}
            <mesh position={[-1.35, -0.18, 0.75]} castShadow receiveShadow>
              <cylinderGeometry args={[0.74, 0.64, 0.18, 36]} />
              <meshStandardMaterial color="#1a1c1e" roughness={0.55} metalness={0.4} />
            </mesh>

            {/* Fiery Tomato-Sesame Chili Achar Dipping Sauce with Glossy Sheen */}
            <mesh position={[-1.35, -0.08, 0.75]}>
              <cylinderGeometry args={[0.67, 0.67, 0.02, 36]} />
              <meshPhysicalMaterial
                color="#c43e18"
                transmission={0.22}
                roughness={0.08}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                ior={1.42}
              />
            </mesh>

            {/* Toasted Sesame Seed Garnish in Sauce */}
            <mesh position={[-1.28, -0.065, 0.72]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial color="#f0dcb8" roughness={0.5} />
            </mesh>
            <mesh position={[-1.42, -0.065, 0.8]}>
              <sphereGeometry args={[0.022, 6, 6]} />
              <meshStandardMaterial color="#f0dcb8" roughness={0.5} />
            </mesh>
            <mesh position={[-1.38, -0.065, 0.68]}>
              <sphereGeometry args={[0.024, 6, 6]} />
              <meshStandardMaterial color="#f0dcb8" roughness={0.5} />
            </mesh>
          </>
        ) : activeDishCategory === 'indochinese' ? (
          <>
            {/* -------------------------------------------------------------
                DISH 2: TANGRA WOK CHILI GARLIC TIGER PRAWN
                Authentic wok-seared jumbo tiger prawn with:
                - Segmented overlapping carapace somites
                - Wok-charred mahogany blistered edges
                - Glistening chili-garlic-soy glaze
                - Fan-shaped tail uropods
                - Curled spring scallion jade ribbons & toasted garlic chips
                - Hand-forged cast-iron tasting skillet
               ------------------------------------------------------------- */}
            {/* Cast Iron Wok Tasting Skillet */}
            <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[2.1, 1.9, 0.16, 42]} />
              <meshStandardMaterial color="#1a1816" roughness={0.7} metalness={0.75} />
            </mesh>
            {/* Sizzling Chili Oil Drop Gloss on Skillet Base */}
            <mesh position={[0, -0.13, 0]}>
              <cylinderGeometry args={[1.85, 1.85, 0.015, 36]} />
              <meshPhysicalMaterial
                color="#a32e12"
                roughness={0.12}
                clearcoat={0.9}
                transmission={0.3}
              />
            </mesh>

            {/* The Curved Segmented Tiger Prawn */}
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

            {/* Wok Char Blister Marks on Outer Ridge */}
            <mesh position={[-0.45, 0.88, 0.12]} rotation={[0.2, 0.4, 0.3]}>
              <sphereGeometry args={[0.11, 8, 8]} />
              <meshStandardMaterial color="#24130b" roughness={0.9} />
            </mesh>
            <mesh position={[0.18, 0.98, -0.06]} rotation={[-0.1, 0.2, 0]}>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color="#22110a" roughness={0.9} />
            </mesh>

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
            {/* -------------------------------------------------------------
                DISH 3: SMOKED HIMALAYAN BOTANICAL ELIXIR
                Faceted crystal Old-Fashioned rocks tumbler with:
                - 12 exterior vertical crystal light-refracting facets
                - Submerged hand-carved glacial ice rock
                - Glowing warm mountain honey-amber botanical liquid
                - Dehydrated blood orange wheel resting against the ice
                - Fresh Himalayan pine/juniper needle sprig
                - Charred cinnamon bark quill
               ------------------------------------------------------------- */}
            {/* Thick Faceted Crystal Tumbler Base (Sham) */}
            <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.05, 0.98, 0.34, 12]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.96}
                roughness={0.03}
                ior={1.54}
                thickness={2.4}
                clearcoat={1.0}
              />
            </mesh>

            {/* 12-Faceted Crystal Glass Tumbler Walls */}
            <mesh position={[0, 0.72, 0]} castShadow>
              <cylinderGeometry args={[1.12, 1.04, 1.35, 12, 1, true]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.97}
                roughness={0.04}
                ior={1.54}
                thickness={1.8}
                clearcoat={1.0}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Amber Botanical Spirit (Meniscus-bounded) */}
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[0.96, 0.9, 1.05, 32]} />
              <meshPhysicalMaterial
                color="#d8741e"
                transmission={0.82}
                roughness={0.1}
                ior={1.38}
                clearcoat={0.9}
              />
            </mesh>

            {/* Large Hand-Chiseled Glacial Ice Rock floating inside */}
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

            {/* Dehydrated Blood Orange Wheel (resting at angle against ice) */}
            <group position={[-0.32, 0.88, 0.22]} rotation={[0.4, -0.6, 0.3]}>
              {/* Outer Citrus Rind */}
              <mesh>
                <cylinderGeometry args={[0.48, 0.48, 0.04, 28]} />
                <meshStandardMaterial color="#ba4416" roughness={0.65} />
              </mesh>
              {/* Inner Translucent Pulp Disc */}
              <mesh position={[0, 0.015, 0]}>
                <cylinderGeometry args={[0.42, 0.42, 0.035, 28]} />
                <meshPhysicalMaterial
                  color="#dc5c1e"
                  transmission={0.45}
                  roughness={0.3}
                  thickness={0.5}
                />
              </mesh>
              {/* Central White Pith Core */}
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
                <meshStandardMaterial color="#dfccaa" roughness={0.7} />
              </mesh>
            </group>

            {/* Fresh Himalayan Pine / Juniper Needle Sprig */}
            <group position={[0.42, 1.15, -0.15]} rotation={[0.25, -0.3, 0.4]}>
              {/* Stem */}
              <mesh>
                <cylinderGeometry args={[0.03, 0.03, 0.85, 8]} />
                <meshStandardMaterial color="#3d2817" roughness={0.8} />
              </mesh>
              {/* Needle clusters */}
              <mesh position={[0.08, 0.15, 0]} rotation={[0, 0, 0.5]}>
                <coneGeometry args={[0.14, 0.45, 8]} />
                <meshStandardMaterial color="#2d6139" roughness={0.6} />
              </mesh>
              <mesh position={[-0.08, 0.28, 0]} rotation={[0, 0, -0.5]}>
                <coneGeometry args={[0.13, 0.4, 8]} />
                <meshStandardMaterial color="#357343" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.42, 0]}>
                <coneGeometry args={[0.12, 0.38, 8]} />
                <meshStandardMaterial color="#3e844f" roughness={0.6} />
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

      {/* 3. Soft Rising Hot Culinary Steam Wisps */}
      <points ref={steamRef} position={[0, 0.5, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          map={steamTexture}
          color={isLight ? '#5a5247' : '#f0ebe2'}
          transparent
          opacity={0.28}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Warm Platter Hearth Uplight */}
      <pointLight
        position={[0, 0.4, 0]}
        color="#d9642a"
        intensity={2.4}
        distance={7}
        decay={2}
      />
    </group>
  );
}

