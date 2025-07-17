import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RainEffect({ count = 1000 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create rain drop positions and velocities
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 100, // Spread around the room
        y: Math.random() * 50 + 20, // Start high up
        z: (Math.random() - 0.5) * 100,
        velocity: Math.random() * 0.05 + 0.05, // Fall speed
        opacity: Math.random() * 0.05 + 0.1, // Varying opacity
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      // Update particle position
      particle.y -= particle.velocity;

      // Reset particle when it hits the ground
      if (particle.y < 0) {
        particle.y = Math.random() * 20 + 30;
        particle.x = (Math.random() - 0.5) * 100;
        particle.z = (Math.random() - 0.5) * 100;
      }

      // Set matrix for each rain drop
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(0.2, 0.7, 0.3); // Thin vertical drops
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <cylinderGeometry args={[0.1, 0.1, 1, 3]} />
      <meshBasicMaterial
        color="#87CEEB"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
