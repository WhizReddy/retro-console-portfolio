/**
 * GameBoyOnDesk.jsx
 * -----------------------------------------------------
 * Loads /game_boy_original.glb, puts it on the desk, adds
 * optional button-click handling and shadows.
 *
 * ‣ Drop the GLB into /public as  game_boy_original.glb
 * ‣ Tweak position / rotation / scale until it sits right.
 * ‣ Props:
 *     • visible   (boolean) – show / hide
 *     • onButton  (fn)      – called with mesh.name when a
 *                             button mesh is clicked
 */

import React, { Suspense, useEffect, useRef } from 'react';
import { useGLTF, PresentationControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export default function GameBoyOnDesk({ visible, onButton }) {
  /* ---------- load GLB ---------- */
  const { scene } = useGLTF('/game_boy_original.glb');

  /* ---------- find button meshes once ---------- */
  const buttons = useRef([]);
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

  /* ---------- ray-cast clicks ---------- */
  const { raycaster, pointer, camera } = useThree();
  useEffect(() => {
    function handle(e) {
      if (!visible) return;
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(buttons.current, true)[0];
      if (hit && onButton) onButton(hit.object.name);
    }
    window.addEventListener('pointerdown', handle);
    return () => window.removeEventListener('pointerdown', handle);
  }, [visible, onButton, pointer, raycaster, camera]);

  /* ---------- nothing rendered when hidden ---------- */
  if (!visible) return null;

  /* ---------- placement tweak here ---------- */
  return (
    <Suspense fallback={null}>
<group position={[0,2,0]}
  rotation={[ -Math.PI / 2, 0, 1 ]}   // ⬅ new angles

scale={0.2}>
  <primitive object={scene} />
  <axesHelper args={[0.5]} />
</group>
    </Suspense>
  );
}

/* preload so there’s no hitch when Stage-2 shows */
useGLTF.preload('/game_boy_original.glb');
    