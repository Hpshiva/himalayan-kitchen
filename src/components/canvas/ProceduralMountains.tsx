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

// Organic serpentine canyon seam offset: replaces razor-sharp straight cut lines with natural undulating curves
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

  // Build Left Ridge Geometry (-80 <= X <= 0), Right Ridge Geometry (0 <= X <= 80), Cleft Bed, and Glacial River
  const {
    leftGeo,
    rightGeo,
    cleftGeo,
    riverGeo,
    foamGeo,
    riverVertCount,
    riverUCoords,
    riverZCoords,
    foamVertCount,
    foamUCoords,
    foamZCoords,
  } = useMemo(() => {
    const halfWidth = 80;
    const depth = 160;
    const xSegments = 54;
    const zSegments = 110;

    // Palette: exact previous mountain colors with dramatic alpine shadows
    const cDeepSlate = isLight ? new THREE.Color('#94a1ae') : new THREE.Color('#dce6f2');
    const cRock = isLight ? new THREE.Color('#cfc7bb') : new THREE.Color('#edf3fa');
    const cSnow = isLight ? new THREE.Color('#ffffff') : new THREE.Color('#ffffff');
    const cAmber = isLight ? new THREE.Color('#e68a4e') : new THREE.Color('#ffffff');

    // Helper to build half-plane mountain geometry
    const buildRidge = (isLeft: boolean) => {
      const geo = new THREE.PlaneGeometry(halfWidth, depth, xSegments, zSegments);
      geo.rotateX(-Math.PI / 2);
      geo.translate(isLeft ? -halfWidth / 2 : halfWidth / 2, 0, 0);

      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);

      for (let i = 0; i < pos.count; i++) {
        const rawX = pos.getX(i);
        const z = pos.getZ(i);

        // 1. Organic Curved Seam
        const distFromSeam = Math.abs(rawX);
        const seamX = getSeamOffset(z);
        const seamBlend = Math.max(0, 1.0 - distFromSeam / 32.0);
        const smoothBlend = Math.pow(seamBlend, 1.25);
        const curvedX = rawX + seamX * smoothBlend;
        pos.setX(i, curvedX);

        // 2. Base mountain elevation
        let y = generateMountainElevation(curvedX, z);

        // 3. Canyon Rim Slope Softening
        if (distFromSeam < 8.0) {
          const edgeT = distFromSeam / 8.0;
          const smoothChamfer = 0.5 - 0.5 * Math.cos(edgeT * Math.PI);
          const floorY = -1.8 + Math.sin(z * 0.15) * 0.35;
          y = THREE.MathUtils.lerp(floorY, y, smoothChamfer);
        }
        pos.setY(i, y);

        // 4. Vertex color calculation
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

    // Central Cleft Bed: natural undulating valley floor between the parted peaks
    const cleft = new THREE.PlaneGeometry(36, 140, 28, 65);
    cleft.rotateX(-Math.PI / 2);
    const cPos = cleft.attributes.position;
    for (let i = 0; i < cPos.count; i++) {
      const cx = cPos.getX(i);
      const cz = cPos.getZ(i);
      const cy = -1.9 + Math.sin(cx * 0.25) * 0.35 + Math.cos(cz * 0.12) * 0.25;
      cPos.setY(i, cy);
    }
    cleft.computeVertexNormals();

    // -------------------------------------------------------------
    // FLOWING GLACIAL RIVER SURFACE GEOMETRY
    // -------------------------------------------------------------
    const rSegsX = 32;
    const rSegsZ = 120;
    const rGeo = new THREE.BufferGeometry();
    const rVertCount = (rSegsX + 1) * (rSegsZ + 1);
    const rPositions = new Float32Array(rVertCount * 3);
    const rU = new Float32Array(rVertCount);
    const rZ = new Float32Array(rVertCount);

    let vIdx = 0;
    for (let iz = 0; iz <= rSegsZ; iz++) {
      const tz = iz / rSegsZ;
      const z = -85 + tz * 150;
      const seamX = getSeamOffset(z);

      for (let ix = 0; ix <= rSegsX; ix++) {
        const u = (ix / rSegsX) * 2 - 1; // -1 to +1
        rU[vIdx] = u;
        rZ[vIdx] = z;

        rPositions[vIdx * 3] = seamX + u * 4.0;
        rPositions[vIdx * 3 + 1] = -1.72;
        rPositions[vIdx * 3 + 2] = z;
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
    rGeo.computeVertexNormals();

    // White-Water Foam Rapids Ribbon
    const fSegsX = 12;
    const fSegsZ = 90;
    const fGeo = new THREE.BufferGeometry();
    const fVertCount = (fSegsX + 1) * (fSegsZ + 1);
    const fPositions = new Float32Array(fVertCount * 3);
    const fU = new Float32Array(fVertCount);
    const fZ = new Float32Array(fVertCount);

    let fIdx = 0;
    for (let iz = 0; iz <= fSegsZ; iz++) {
      const tz = iz / fSegsZ;
      const z = -80 + tz * 140;
      for (let ix = 0; ix <= fSegsX; ix++) {
        const u = (ix / fSegsX) * 2 - 1;
        fU[fIdx] = u;
        fZ[fIdx] = z;
        fPositions[fIdx * 3] = 0;
        fPositions[fIdx * 3 + 1] = -1.70;
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
      foamVertCount: fVertCount,
      foamUCoords: fU,
      foamZCoords: fZ,
    };
  }, [theme, isLight]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Mountain Parting Curve on scroll:
    // 0.00 - 0.14: Completely closed (High Summit)
    // 0.14 - 0.45: Smoothly parts open (4.6 units max) and river swells!
    // 0.45 - 0.70: Stays gently open during hero altar inspection
    // 0.70 - 0.90: Smoothly CLOSES back together!
    // 0.90 - 1.00 and all subsequent chapters: Completely closed (0.0 gap)
    let partingT = 0;
    if (heroProgress < 0.14) {
      partingT = 0;
    } else if (heroProgress < 0.45) {
      partingT = THREE.MathUtils.smoothstep(heroProgress, 0.14, 0.45);
    } else if (heroProgress < 0.70) {
      partingT = 1.0;
    } else if (heroProgress < 0.90) {
      partingT = 1.0 - THREE.MathUtils.smoothstep(heroProgress, 0.70, 0.90);
    } else {
      partingT = 0;
    }

    const partAmount = partingT * 4.6;

    const basePosY = -2 - scrollProgress * 3;
    const basePosZ = -15 + scrollProgress * 10;

    if (leftGroupRef.current) {
      leftGroupRef.current.position.set(-partAmount, basePosY, basePosZ);
      leftGroupRef.current.rotation.y = -partingT * 0.035;
      leftGroupRef.current.rotation.z = -partingT * 0.015;
    }
    if (rightGroupRef.current) {
      rightGroupRef.current.position.set(partAmount, basePosY, basePosZ);
      rightGroupRef.current.rotation.y = partingT * 0.035;
      rightGroupRef.current.rotation.z = partingT * 0.015;
    }
    if (cleftBedRef.current) {
      cleftBedRef.current.position.set(0, basePosY, basePosZ);
      cleftBedRef.current.visible = partingT > 0.01;
    }

    // Dynamic Glacial River Wave Animation
    if (riverMeshRef.current) {
      riverMeshRef.current.position.set(0, basePosY, basePosZ);
      riverMeshRef.current.visible = partingT > 0.01;

      if (partingT > 0.01) {
        const pos = riverGeo.attributes.position;
        const posArr = pos.array as Float32Array;
        const riverHalfWidth = 2.2 + partingT * 4.4; // Dynamically expands as canyon opens
        const flowSpeed = time * (3.5 + partingT * 1.8);

        for (let i = 0; i < riverVertCount; i++) {
          const u = riverUCoords[i];
          const z = riverZCoords[i];
          const seamX = getSeamOffset(z);
          const x = seamX + u * riverHalfWidth;

          // River longitudinal current waves flowing downstream (+Z)
          const w1 = Math.sin(z * 0.38 - flowSpeed + u * 1.4) * 0.10;
          const w2 = Math.cos(z * 0.85 - flowSpeed * 1.4 - u * 2.0) * 0.05;
          const y = -1.70 + (w1 + w2) * (0.7 + partingT * 0.3);

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
        const foamHalfWidth = 1.4 + partingT * 2.2;
        const flowSpeed = time * (3.8 + partingT * 2.0);

        for (let i = 0; i < foamVertCount; i++) {
          const u = foamUCoords[i];
          const z = foamZCoords[i];
          const seamX = getSeamOffset(z);
          const x = seamX + u * foamHalfWidth;

          const w1 = Math.sin(z * 0.38 - flowSpeed + u * 1.4) * 0.10;
          const y = -1.68 + w1 * (0.7 + partingT * 0.3) + 0.02;

          posArr[i * 3] = x;
          posArr[i * 3 + 1] = y;
          posArr[i * 3 + 2] = z;
        }
        pos.needsUpdate = true;

        const mat = rapidsFoamRef.current.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.opacity = 0.2 + partingT * 0.45;
        }
      }
    }
  });

  return (
    <group>
      {/* Central Volcanic Cleft Floor (Original Bedrock) */}
      <mesh ref={cleftBedRef} geometry={cleftGeo} receiveShadow>
        <meshStandardMaterial
          color={isLight ? '#dfd9ce' : '#223040'}
          roughness={0.92}
          metalness={0.06}
          flatShading
        />
      </mesh>

      {/* Glacial Meltwater River (Appears and flows on scroll when mountains part) */}
      <mesh ref={riverMeshRef} geometry={riverGeo}>
        <meshStandardMaterial
          color={isLight ? '#06b6d4' : '#0284c7'}
          emissive={isLight ? '#083344' : '#0c4a6e'}
          roughness={0.08}
          metalness={0.35}
          transparent
          opacity={0.88}
          flatShading={false}
        />
      </mesh>

      {/* White-Water Rapids Foam Crests */}
      <mesh ref={rapidsFoamRef} geometry={foamGeo}>
        <meshStandardMaterial
          color="#f0fdfa"
          emissive="#e0f2fe"
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={0.3}
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
