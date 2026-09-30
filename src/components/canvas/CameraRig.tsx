import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CameraRigProps {
  scrollProgress: number;
  heroProgress?: number;
}

export function CameraRig({ scrollProgress, heroProgress = 0 }: CameraRigProps) {
  const currentPos = useRef(new THREE.Vector3(0, 8.5, 38));
  const currentLookAt = useRef(new THREE.Vector3(0, 7.5, 0));

  useFrame((state) => {
    const { pointer, camera } = state;

    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    // HERO STAGES (when in Hero section):
    // 0.00 - 0.18: Monumental Towering Peaks Summit (Hero title stage)
    // 0.18 - 0.52: Mountain dive through the parting peaks towards the rising dish
    // 0.52 - 0.82: Macro inspection of the levitating dish & steam
    // 0.82 - 1.00: Gentle descent towards hearth table

    if (heroProgress < 0.98) {
      if (heroProgress < 0.18) {
        // Towering Peaks: Monumental low angle looking up at the majestic summits
        const t = heroProgress / 0.18;
        const startPos = new THREE.Vector3(0, 8.5, 38);
        const startLookAt = new THREE.Vector3(0, 7.5, 0);

        targetPos.lerpVectors(startPos, new THREE.Vector3(0, 20, 44), t);
        targetLookAt.lerpVectors(startLookAt, new THREE.Vector3(0, 3.5, 0), t);
      } else if (heroProgress < 0.45) {
        // Diving down towards the cleft
        const t = (heroProgress - 0.18) / 0.27;
        const smoothT = THREE.MathUtils.smoothstep(t, 0, 1);
        targetPos.set(
          0,
          THREE.MathUtils.lerp(20, 4.4, smoothT),
          THREE.MathUtils.lerp(44, 19.2, smoothT)
        );
        targetLookAt.set(
          0,
          THREE.MathUtils.lerp(3.5, 1.2, smoothT),
          THREE.MathUtils.lerp(0, 9.2, smoothT)
        );
      } else if (heroProgress < 0.72) {
        // Centerpiece focus: Generous breathing room, text remains completely readable
        const t = (heroProgress - 0.45) / 0.27;
        targetPos.set(
          Math.sin(t * Math.PI) * 0.6,
          4.4 + Math.sin(state.clock.elapsedTime * 1.0) * 0.08,
          19.2
        );
        targetLookAt.set(0, 1.2, 9.2);
      } else {
        // Descent towards lodge hearth as mountains close
        const t = (heroProgress - 0.72) / 0.28;
        targetPos.set(0, THREE.MathUtils.lerp(4.4, 5.8, t), THREE.MathUtils.lerp(19.2, 20.0, t));
        targetLookAt.set(0, THREE.MathUtils.lerp(1.2, 2.0, t), THREE.MathUtils.lerp(9.2, 6.0, t));
      }
    } else {
      // Lower page scroll stages (Journey -> Cuisine -> Atmosphere)
      if (scrollProgress < 0.55) {
        const t = (scrollProgress - 0.28) / 0.27;
        targetPos.set(
          THREE.MathUtils.lerp(0, -2.5, t),
          THREE.MathUtils.lerp(5.8, 6.5, t),
          THREE.MathUtils.lerp(19.0, 22.0, t)
        );
        targetLookAt.set(0, THREE.MathUtils.lerp(2.2, 2.0, t), THREE.MathUtils.lerp(6.0, -4, t));
      } else {
        const t = (scrollProgress - 0.55) / 0.45;
        targetPos.set(
          THREE.MathUtils.lerp(-2.5, 0, t),
          THREE.MathUtils.lerp(6.5, 3.5, t),
          THREE.MathUtils.lerp(22.0, 11.0, t)
        );
        targetLookAt.set(0, THREE.MathUtils.lerp(2.0, 1.8, t), -2);
      }
    }

    // Dynamic mouse parallax
    const parallaxX = pointer.x * 1.5;
    const parallaxY = -pointer.y * 0.9;

    targetPos.x += parallaxX;
    targetPos.y += parallaxY;

    // Smooth inertia interpolation
    currentPos.current.lerp(targetPos, 0.06);
    currentLookAt.current.lerp(targetLookAt, 0.06);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
