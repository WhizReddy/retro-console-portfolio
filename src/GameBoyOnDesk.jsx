// GameBoyOnDesk.jsx - Updated with proper desk positioning
import React, { Suspense, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function GameBoyOnDesk({ visible, onButton }) {
  const { scene } = useGLTF('/game_boy_original.glb');
  const buttons = useRef([]);
  
  // Find button meshes once
  useEffect(() => {
    if (!scene) return;
    buttons.current = [
      'Button_A',
      'Button_B', 
      'Dpad_Up',
      'Dpad_Down',
      'Dpad_Left',
      'Dpad_Right',
    ]
      .map((n) => scene.getObjectByName(n))
      .filter(Boolean);
  }, [scene]);

  // Ray-cast clicks
  const gbRef = useRef();   // <-- add this

    useEffect(() => {
    function onKey(e) {
      if (!visible) return;
      const p = gbRef.current.position;
      const step = e.shiftKey ? 0.1 : 0.02;     // hold Shift for bigger jumps
      switch (e.key) {
        case 'ArrowUp':    p.z -= step; break;  // towards camera
        case 'ArrowDown':  p.z += step; break;
        case 'ArrowLeft':  p.x -= step; break;
        case 'ArrowRight': p.x += step; break;
        case 'PageUp':     p.y += step; break;  // raise / lower
        case 'PageDown':   p.y -= step; break;
        case 'q':          gbRef.current.rotation.z += 0.05; break;
        case 'e':          gbRef.current.rotation.z -= 0.05; break;
        default: return;
      }
      console.log(
        `pos = [${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)}]`,
        `rot.z = ${gbRef.current.rotation.z.toFixed(3)}`
      );
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  // REPLACE THESE VALUES WITH YOUR ACTUAL DESK MEASUREMENTS:
  const DESK_POS = useRef([0, 16.10, 0]);        // Y = 16.10 from probe
  const DESK_CENTER_X = 0.0;     // slide until centred
  const DESK_CENTER_Z = 0.0;     // slide toward/away camera

  return (
    <Suspense fallback={null}>
<group
  ref={gbRef}
  position={DESK_POS.current}
  rotation={[-Math.PI / 2, 0, 0]}              // flat; we’ll tweak later
  scale={0.2}
>
        <primitive object={scene} />
        {/* Uncomment to see axes while positioning */}
        {/* <axesHelper args={[0.5]} /> */}
      </group>
    </Suspense>
  );
}

useGLTF.preload('/game_boy_original.glb');