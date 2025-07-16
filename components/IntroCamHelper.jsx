// src/components/IntroCamHelper.jsx
import { useControls } from 'leva';
import { useThree, useFrame } from '@react-three/fiber';

export default function IntroCamHelper() {
  const { camera } = useThree();

  const gui = useControls('Intro-Cam', {
    x:  { value: camera.position.x, min: -10, max: 10, step: 0.01 },
    y:  { value: camera.position.y, min:   0, max: 10, step: 0.01 },
    z:  { value: camera.position.z, min:   0, max: 10, step: 0.01 },
    tx: { value: 0, min: -5, max: 5, step: 0.01 },
    ty: { value: 0, min:  0, max: 5, step: 0.01 },
    tz: { value: 0, min: -5, max: 5, step: 0.01 },
  });

  useFrame(() => {
    camera.position.set(gui.x, gui.y, gui.z);
    camera.lookAt(gui.tx, gui.ty, gui.tz);
  });

  return null;
}
