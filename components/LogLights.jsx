/* src/components/LogLights.jsx */
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export default function LogLights() {
  const { scene } = useThree();
  useEffect(() => {
    const lights = [];
    scene.traverse(o => o.isLight && lights.push(o));
    console.table(
      lights.map(l => ({
        type: l.type,
        intensity: l.intensity,
        name: l.name || '(no-name)',
      }))
    );
  }, [scene]);
  return null;
}
