import { useThree, useFrame } from '@react-three/fiber';
import { useControls, button } from 'leva';

/**
 * Live-tweak ONLY Stage-0 (landing) pos / target.
 * Copy the printed arrays into CameraSpring when satisfied.
 */
export default function IntroCamHelper() {
  const camera = useThree((s) => s.camera);

  /* current values become slider defaults */
  const gui = useControls('Intro-Cam', {
    x:  { value: camera.position.x, min: -10, max: 10, step: 0.01 },
    y:  { value: camera.position.y, min: -10, max: 10, step: 0.01 },
    z:  { value: camera.position.z, min: -10, max: 15, step: 0.01 },
    tx: { value: 0.8,  min: -5, max: 5, step: 0.01 },
    ty: { value: 1.5,  min: -5, max: 5, step: 0.01 },
    tz: { value: 0.0,  min: -5, max: 5, step: 0.01 },
    copy: button(() => {
      const p = [gui.x, gui.y, gui.z].map(n => +n.toFixed(2));
      const t = [gui.tx, gui.ty, gui.tz].map(n => +n.toFixed(2));
      // eslint-disable-next-line no-console
      console.log('Stage-0  →  pos:', p, ', target:', t);
    })
  });

  /* apply sliders live each frame */
  useFrame(() => {
    camera.position.set(gui.x, gui.y, gui.z);
    camera.lookAt(gui.tx, gui.ty, gui.tz);
  });

  return null;
}
