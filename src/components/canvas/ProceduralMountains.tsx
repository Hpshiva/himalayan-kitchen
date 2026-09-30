import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Multi-octave pseudo-perlin mountain elevation generator (faceted alpine ridges)
function generateMountainElevation(x: number, z: number): number {
  const f1 = 0.035;
  const f2 = 0.08;
  const f3 = 0.18;
  const f4 = 0.35;

  let y = Math.sin(x * f1) * Math.cos(z * f1) * 14.0;
  y += Math.cos(x * f2 + 1.2) * Math.sin(z * f2 + 0.8) * 6.5;
  y += Math.sin(x * f3 + z * f2) * 2.8;
  y += Math.sin(x * f4) * Math.cos(z * f4) * 1.2;

  const valleyDist = Math.abs(x);
  const valleyFactor = Math.min(1.0, valleyDist / 18.0);
  const valleyDepth = Math.pow(valleyFactor, 1.8);

  y = Math.sign(y) * Math.pow(Math.abs(y), 1.15) * valleyDepth;
  y += Math.pow(valleyDist / 25.0, 2) * 7.0;

  return y;
}

// Organic serpentine canyon seam offset: natural meandering river valley curve
function getSeamOffset(z: number): number {
  return (
    Math.sin(z * 0.038) * 3.2 +
    Math.cos(z * 0.082 + 0.7) * 1.8 +
    Math.sin(z * 0.16) * 0.9
  );
}

interface ProceduralMountainsProps {
  scrollProgress: number;
  heroProgress?: number;
  theme?: 'dark' | 'light';
}

export function ProceduralMountains({
  scrollProgress,
  heroProgress = 0,
  theme = 'dark',
}: ProceduralMountainsProps) {
  const leftGroupRef = useRef<THREE.Group>(null);
  const rightGroupRef = useRef<THREE.Group>(null);
  const cleftBedRef = useRef<THREE.Mesh>(null);
  const riverMeshRef = useRef<THREE.Mesh>(null);
  const rapidsFoamRef = useRef<THREE.Mesh>(null);

  const isLight = theme === 'light';

  // Build Left Ridge (-80 <= X <= 0), Right Ridge (0 <= X <= 80), Submerged Riverbed, and Flowing Glacial River
  const {
    leftGeo,
    rightGeo,
    cleftGeo,
    riverGeo,
    foamGeo,
    riverVertCount,
    riverUCoords,
    riverZCoords,
    riverDistanceTapers,
    foamVertCount,
    foamUCoords,
    foamZCoords,
    foamDistanceTapers,
  } = useMemo(() => {
    const halfWidth = 80;
    const depth = 160;
    const xSegments = 54;
    const zSegments = 110;

    // Palette: exact original mountain colors with crisp, dramatic alpine shadows
    const cDeepSlate = isLight ? new THREE.Color('#94a1ae') : new THREE.Color('#dce6f2');
    const cRock = isLight ? new THREE.Color('#cfc7bb') : new THREE.Color('#edf3fa');
    const cSnow = isLight ? new THREE.Color('#ffffff') : new THREE.Color('#ffffff');
    const cAmber = isLight ? new THREE.Color('#e68a4e') : new THREE.Color('#ffffff');

    // -------------------------------------------------------------
    // 1. MOUNTAIN RIDGES (100% Original Geometry, Shading & Palette)
    // -------------------------------------------------------------
    const buildRidge = (isLeft: boolean) => {
      const geo = new THREE.PlaneGeometry(halfWidth, depth, xSegments, zSegments);
      geo.rotateX(-Math.PI / 2);
      geo.translate(isLeft ? -halfWidth / 2 : halfWidth / 2, 0, 0);

      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);

      for (let i = 0; i < pos.count; i++) {
        const rawX = pos.getX(i);
        const z = pos.getZ(i);

        // Curving canyon seam alignment
        const distFromSeam = Math.abs(rawX);
        const seamX = getSeamOffset(z);
        const seamBlend = Math.max(0, 1.0 - distFromSeam / 32.0);
        const smoothBlend = Math.pow(seamBlend, 1.25);
        const curvedX = rawX + seamX * smoothBlend;
        pos.setX(i, curvedX);

        // Base mountain elevation
        let y = generateMountainElevation(curvedX, z);

        // Canyon rim chamfer rolling naturally down to the riverbank floor
        if (distFromSeam < 8.0) {
          const edgeT = distFromSeam / 8.0;
          const smoothChamfer = 0.5 - 0.5 * Math.cos(edgeT * Math.PI);
          const floorY = -1.85 + Math.sin(z * 0.15) * 0.15;
          y = THREE.MathUtils.lerp(floorY, y, smoothChamfer);
        }
        pos.setY(i, y);

        // Faceted vertex color gradient
        const tempColor = new THREE.Color();
        if (y < 2) {
          tempColor.copy(cDeepSlate);
        } else if (y < 8) {
          const t = (y - 2) / 6;
          tempColor.copy(cDeepSlate).lerp(cRock, t);
        } else if (y < 14) {
          const t = (y - 8) / 6;
          tempColor.copy(cRock).lerp(cSnow, t * 0.9);
        } else {
          const t = Math.min(1, (y - 14) / 5);
          tempColor.copy(cSnow).lerp(cAmber, t * 0.4);
        }

        // Soften rim color into warm canyon bedrock
        if (distFromSeam < 7.0) {
          const rimT = distFromSeam / 7.0;
          const cFloorBedrock = isLight ? new THREE.Color('#dfd9ce') : new THREE.Color('#384858');
          tempColor.lerp(cFloorBedrock, Math.pow(1.0 - rimT, 1.2) * 0.82);
        }

        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
      }

      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.computeVertexNormals();
      return geo;
    };

    // -------------------------------------------------------------
    // 2. SUBMERGED CANYON RIVERBED (Deep Channel Under the Water)
    // -------------------------------------------------------------
    const cSegsX = 26;
    const cSegsZ = 120;
    const cleft = new THREE.BufferGeometry();
    const cVertCount = (cSegsX + 1) * (cSegsZ + 1);
    const cPositions = new Float32Array(cVertCount * 3);
    const cColors = new Float32Array(cVertCount * 3);

    const cSiltDark = isLight ? new THREE.Color('#baa896') : new THREE.Color('#1c2834');
    const cSiltLight = isLight ? new THREE.Color('#cfc7bb') : new THREE.Color('#283a4c');

    let cIdx = 0;
    for (let iz = 0; iz <= cSegsZ; iz++) {
      const tz = iz / cSegsZ;
      const z = -95 + tz * 170;
      const seamX = getSeamOffset(z);

      for (let ix = 0; ix <= cSegsX; ix++) {
        const u = (ix / cSegsX) * 2 - 1; // -1 to +1
        const bankDist = Math.abs(u);
        const bedWidth = 5.2;

        cPositions[cIdx * 3] = seamX + u * bedWidth;
        // Concave channel: deep in center (-2.85), sloping up to riverbank (-2.30)
        const bedY = -2.85 + Math.pow(bankDist, 1.6) * 0.55 + Math.sin(z * 0.12) * 0.10;
        cPositions[cIdx * 3 + 1] = bedY;
        cPositions[cIdx * 3 + 2] = z;

        const col = cSiltDark.clone().lerp(cSiltLight, bankDist);
        cColors[cIdx * 3] = col.r;
        cColors[cIdx * 3 + 1] = col.g;
        cColors[cIdx * 3 + 2] = col.b;
        cIdx++;
      }
    }

    const cIndices: number[] = [];
    for (let iz = 0; iz < cSegsZ; iz++) {
      for (let ix = 0; ix < cSegsX; ix++) {
        const a = iz * (cSegsX + 1) + ix;
        const b = a + 1;
        const c = a + (cSegsX + 1);
        const d = c + 1;
        cIndices.push(a, c, b);
        cIndices.push(b, c, d);
      }
    }
    cleft.setIndex(cIndices);
    cleft.setAttribute('position', new THREE.BufferAttribute(cPositions, 3));
    cleft.setAttribute('color', new THREE.BufferAttribute(cColors, 3));
    cleft.computeVertexNormals();

    // -------------------------------------------------------------
    // 3. GLACIAL MELTWATER RIVER SURFACE
    // -------------------------------------------------------------
    const rSegsX = 32;
    const rSegsZ = 130;
    const rGeo = new THREE.BufferGeometry();
    const rVertCount = (rSegsX + 1) * (rSegsZ + 1);
    const rPositions = new Float32Array(rVertCount * 3);
    const rColors = new Float32Array(rVertCount * 3);
    const rU = new Float32Array(rVertCount);
    const rZ = new Float32Array(rVertCount);
    const rTapers = new Float32Array(rVertCount);

    const cWaterDeep = isLight ? new THREE.Color('#0284c7') : new THREE.Color('#0369a1');
    const cWaterAqua = isLight ? new THREE.Color('#38bdf8') : new THREE.Color('#0ea5e9');

    let vIdx = 0;
    for (let iz = 0; iz <= rSegsZ; iz++) {
      const tz = iz / rSegsZ;
      const z = -95 + tz * 170;
      const seamX = getSeamOffset(z);

      // Smooth distance taper towards foggy horizon and behind camera
      const headTaper = Math.min(1.0, Math.max(0, (z - (-95)) / 28.0));
      const tailTaper = Math.min(1.0, Math.max(0, (75 - z) / 22.0));
      const distanceTaper = headTaper * tailTaper;

      for (let ix = 0; ix <= rSegsX; ix++) {
        const u = (ix / rSegsX) * 2 - 1; // -1 to +1
        rU[vIdx] = u;
        rZ[vIdx] = z;
        rTapers[vIdx] = distanceTaper;

        rPositions[vIdx * 3] = seamX;
        rPositions[vIdx * 3 + 1] = -2.12;
        rPositions[vIdx * 3 + 2] = z;

        // Gradient from deep glacier blue in center to luminous aquamarine at banks
        const col = cWaterDeep.clone().lerp(cWaterAqua, Math.pow(Math.abs(u), 1.3));
        rColors[vIdx * 3] = col.r;
        rColors[vIdx * 3 + 1] = col.g;
        rColors[vIdx * 3 + 2] = col.b;
        vIdx++;
      }
    }

    const rIndices: number[] = [];
    for (let iz = 0; iz < rSegsZ; iz++) {
      for (let ix = 0; ix < rSegsX; ix++) {
        const a = iz * (rSegsX + 1) + ix;
        const b = a + 1;
        const c = a + (rSegsX + 1);
        const d = c + 1;
        rIndices.push(a, c, b);
        rIndices.push(b, c, d);
      }
    }
    rGeo.setIndex(rIndices);
    rGeo.setAttribute('position', new THREE.BufferAttribute(rPositions, 3));
    rGeo.setAttribute('color', new THREE.BufferAttribute(rColors, 3));
    rGeo.computeVertexNormals();

    // -------------------------------------------------------------
    // 4. WHITE-WATER RAPIDS & FOAM CRESTS
    // -------------------------------------------------------------
    const fSegsX = 16;
    const fSegsZ = 90;
    const fGeo = new THREE.BufferGeometry();
    const fVertCount = (fSegsX + 1) * (fSegsZ + 1);
    const fPositions = new Float32Array(fVertCount * 3);
    const fU = new Float32Array(fVertCount);
    const fZ = new Float32Array(fVertCount);
    const fTapers = new Float32Array(fVertCount);

    let fIdx = 0;
    for (let iz = 0; iz <= fSegsZ; iz++) {
      const tz = iz / fSegsZ;
      const z = -85 + tz * 150;
      const headTaper = Math.min(1.0, Math.max(0, (z - (-85)) / 25.0));
      const tailTaper = Math.min(1.0, Math.max(0, (65 - z) / 20.0));
      const distanceTaper = headTaper * tailTaper;

      for (let ix = 0; ix <= fSegsX; ix++) {
        const u = (ix / fSegsX) * 2 - 1;
        fU[fIdx] = u;
        fZ[fIdx] = z;
        fTapers[fIdx] = distanceTaper;

        fPositions[fIdx * 3] = 0;
        fPositions[fIdx * 3 + 1] = -2.10;
        fPositions[fIdx * 3 + 2] = z;
        fIdx++;
      }
    }

    const fIndices: number[] = [];
    for (let iz = 0; iz < fSegsZ; iz++) {
      for (let ix = 0; ix < fSegsX; ix++) {
        const a = iz * (fSegsX + 1) + ix;
        const b = a + 1;
        const c = a + (fSegsX + 1);
        const d = c + 1;
        fIndices.push(a, c, b);
        fIndices.push(b, c, d);
      }
    }
    fGeo.setIndex(fIndices);
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPositions, 3));
    fGeo.computeVertexNormals();

    return {
      leftGeo: buildRidge(true),
      rightGeo: buildRidge(false),
      cleftGeo: cleft,
      riverGeo: rGeo,
      foamGeo: fGeo,
      riverVertCount: rVertCount,
      riverUCoords: rU,
      riverZCoords: rZ,
      riverDistanceTapers: rTapers,
      foamVertCount: fVertCount,
      foamUCoords: fU,
      foamZCoords: fZ,
      foamDistanceTapers: fTapers,
    };
  }, [theme, isLight]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Mountain canyon opening timeline on scroll:
    // 0.00 - 0.08: Standing closed at High Summit
    // 0.08 - 0.45: Smoothly parts open, revealing the flowing glacial river in the canyon floor
    // >= 0.45: Remains organically parted as a majestic alpine valley throughout the expedition!
    let partingT = 0;
    if (heroProgress < 0.08) {
      partingT = 0;
    } else if (heroProgress < 0.45) {
      partingT = THREE.MathUtils.smoothstep(heroProgress, 0.08, 0.45);
    } else {
      partingT = 1.0;
    }

    const partAmount = partingT * 4.8;

    const basePosY = -2 - scrollProgress * 3;
    const basePosZ = -15 + scrollProgress * 10;

    if (leftGroupRef.current) {
      leftGroupRef.current.position.set(-partAmount, basePosY, basePosZ);
      leftGroupRef.current.rotation.y = -partingT * 0.032;
      leftGroupRef.current.rotation.z = -partingT * 0.012;
    }
    if (rightGroupRef.current) {
      rightGroupRef.current.position.set(partAmount, basePosY, basePosZ);
      rightGroupRef.current.rotation.y = partingT * 0.032;
      rightGroupRef.current.rotation.z = partingT * 0.012;
    }
    if (cleftBedRef.current) {
      cleftBedRef.current.position.set(0, basePosY, basePosZ);
      cleftBedRef.current.visible = partingT > 0.005;
    }

    // Dynamic Glacial River Wave Animation
    if (riverMeshRef.current) {
      riverMeshRef.current.position.set(0, basePosY, basePosZ);
      riverMeshRef.current.visible = partingT > 0.005;

      if (partingT > 0.005) {
        const pos = riverGeo.attributes.position;
        const posArr = pos.array as Float32Array;
        // River width safely fits within canyon floor (never clips into mountain rock)
        const maxRiverHalfWidth = partAmount * 0.80;
        const flowSpeed = time * 2.8;

        for (let i = 0; i < riverVertCount; i++) {
          const u = riverUCoords[i];
          const z = riverZCoords[i];
          const taper = riverDistanceTapers[i];
          const seamX = getSeamOffset(z);
          const currentHalfWidth = maxRiverHalfWidth * taper;
          const x = seamX + u * currentHalfWidth;

          // Multi-harmonic river current waves flowing downstream (+Z)
          const wave1 = Math.sin(z * 0.42 - flowSpeed + u * 1.5) * 0.045;
          const wave2 = Math.cos(z * 0.88 - flowSpeed * 1.6 - u * 2.2) * 0.025;
          const ripple = Math.sin(z * 2.2 - flowSpeed * 2.6 + u * 4.0) * 0.015;
          const y = -2.12 + (wave1 + wave2 + ripple) * partingT;

          posArr[i * 3] = x;
          posArr[i * 3 + 1] = y;
          posArr[i * 3 + 2] = z;
        }
        pos.needsUpdate = true;
        riverGeo.computeVertexNormals();
      }
    }

    // Dynamic Rapids Foam Animation
    if (rapidsFoamRef.current) {
      rapidsFoamRef.current.position.set(0, basePosY, basePosZ);
      rapidsFoamRef.current.visible = partingT > 0.05;

      if (partingT > 0.05) {
        const pos = foamGeo.attributes.position;
        const posArr = pos.array as Float32Array;
        const foamHalfWidth = partAmount * 0.45;
        const flowSpeed = time * 3.2;

        for (let i = 0; i < foamVertCount; i++) {
          const u = foamUCoords[i];
          const z = foamZCoords[i];
          const taper = foamDistanceTapers[i];
          const seamX = getSeamOffset(z);
          const x = seamX + u * foamHalfWidth * taper;

          const wave1 = Math.sin(z * 0.42 - flowSpeed + u * 1.5) * 0.045;
          const wave2 = Math.cos(z * 0.88 - flowSpeed * 1.6 - u * 2.2) * 0.025;
          const y = -2.10 + (wave1 + wave2) * partingT + 0.02;

          posArr[i * 3] = x;
          posArr[i * 3 + 1] = y;
          posArr[i * 3 + 2] = z;
        }
        pos.needsUpdate = true;

        const mat = rapidsFoamRef.current.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.opacity = 0.15 + partingT * 0.35;
        }
      }
    }
  });

  return (
    <group>
      {/* Submerged Canyon Riverbed Channel (Dry Floor Under River) */}
      <mesh ref={cleftBedRef} geometry={cleftGeo} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.94}
          metalness={0.06}
          flatShading
        />
      </mesh>

      {/* Glacial Meltwater River (Glistening Azure Water Flowing in Canyon) */}
      <mesh ref={riverMeshRef} geometry={riverGeo} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.06}
          metalness={0.22}
          transparent
          opacity={0.92}
          depthWrite={true}
          flatShading={false}
        />
      </mesh>

      {/* White-Water Rapids Foam Crests */}
      <mesh ref={rapidsFoamRef} geometry={foamGeo}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#bae6fd"
          roughness={0.3}
          metalness={0.05}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          flatShading={false}
        />
      </mesh>

      {/* Western / Left Mountain Ridge (100% Original Geometry, Colors & Shadows) */}
      <group ref={leftGroupRef}>
        <mesh geometry={leftGeo} receiveShadow castShadow>
          <meshStandardMaterial
            vertexColors
            roughness={isLight ? 0.72 : 0.55}
            metalness={isLight ? 0.18 : 0.08}
            emissive={isLight ? '#000000' : '#1e2d3d'}
            flatShading
          />
        </mesh>
      </group>

      {/* Eastern / Right Mountain Ridge (100% Original Geometry, Colors & Shadows) */}
      <group ref={rightGroupRef}>
        <mesh geometry={rightGeo} receiveShadow castShadow>
          <meshStandardMaterial
            vertexColors
            roughness={isLight ? 0.72 : 0.55}
            metalness={isLight ? 0.18 : 0.08}
            emissive={isLight ? '#000000' : '#1e2d3d'}
            flatShading
          />
        </mesh>
      </group>
    </group>
  );
}

// DistantPeakSilhouettes dummy exported for backward-compatibility
export function DistantPeakSilhouettes() {
  return null;
}
