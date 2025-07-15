import { useThree, useFrame } from '@react-three/fiber';
import { useControls, button } from 'leva';

export default function TweakCamera() {
  const camera   = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);   // may be null on first render

  // Safe fallback values when controls === null
  const target = controls ? controls.target : { x: 0, y: 0, z: 0 };

  const gui = useControls('Intro Cam', {
    x:  { value: camera.position.x, min: -5, max: 5, step: 0.01 },
    y:  { value: camera.position.y, min: -5, max: 5, step: 0.01 },
    z:  { value: camera.position.z, min: -5, max: 5, step: 0.01 },
    tx: { value: target.x,          min: -5, max: 5, step: 0.01 },
    ty: { value: target.y,          min: -5, max: 5, step: 0.01 },
    tz: { value: target.z,          min: -5, max: 5, step: 0.01 },
    copy: button(() => {
      const p = [gui.x, gui.y, gui.z].map(n => +n.toFixed(2));
      const t = [gui.tx, gui.ty, gui.tz].map(n => +n.toFixed(2));
      console.log('Paste into spring:\n  pos:', p, ', target:', t);
    })
  });

  useFrame(() => {
    camera.position.set(gui.x, gui.y, gui.z);
    if (controls) {
      controls.target.set(gui.tx, gui.ty, gui.tz);
      controls.update();
    }
  });

  return null;
}
