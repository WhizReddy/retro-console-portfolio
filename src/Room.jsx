const ROOM_SCALE = 0.00095;      // <-- new

return (
  <primitive
    ref={ref}
    object={scene}
    scale={ROOM_SCALE}
    position={[0, 0, 0]}          // no extra lift
    castShadow
    receiveShadow
  />
);