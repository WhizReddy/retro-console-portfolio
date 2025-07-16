// DeskProbe.jsx  –  world-space version (prints once)
import { Box3 } from 'three';
import { useEffect } from 'react';

export default function DeskProbe({ target }) {
  useEffect(() => {
    if (!target.current) return;

    // Make sure all matrices include the parent's scale/position
    target.current.updateWorldMatrix(true, true);

    const box = new Box3();
    console.group('%c[DeskProbe] world-space mesh tops (scaled)', 'color:#6cf');
    target.current.traverse((child) => {
      if (!child.isMesh) return;
      // setFromObject now uses child.matrixWorld which is up-to-date
      box.setFromObject(child);
      console.log(child.name.padEnd(28), 'topY =', box.max.y.toFixed(3));
    });
    console.groupEnd();
  }, [target]);

  return null;                    // renders nothing
}
