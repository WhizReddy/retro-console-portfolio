import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PresentationControls, useGLTF, Environment } from '@react-three/drei';
import { useSpring } from '@react-spring/three';
import FlappyBirdCanvas from './FlappyBirdCanvas';
import GameBoyOnDesk from './GameBoyOnDesk';

/* ─────────────────── Camera (scroll-driven) ─────────────────── */
function CameraSpring({ stage }) {
  const { camera } = useThree();
  const { pos, tgt } = useSpring({
    pos:  stage === 0 ? [1.6, 2.2, 4.8]
         : stage === 1 ? [2.0, 1.5, 3.2]
         : stage === 2 ? [2.2, 1.3, 1.8]
         :               [2.22,1.27,1.6],
    tgt:  stage === 0 ? [0.8, 1.1, 0.0]
         : stage === 1 ? [1.0, 0.5, 0.0]
         : stage === 2 ? [1.1, 0.5, 0.2]
         :               [1.11,0.5,0.2],
    config: { mass: 2, tension: 120, friction: 40 }
  });

  useFrame(() => {
    camera.position.fromArray(pos.get());
    camera.lookAt(...tgt.get());
  });
  return null;
}

/* ─────────────────── Room model ─────────────────── */
function Room() {
  const { scene } = useGLTF('/room_lowpoly.glb');
  return <primitive object={scene} receiveShadow />;
}
useGLTF.preload('/room_lowpoly.glb');

/* ─────────────────── Overlay ─────────────────── */
function AboutOverlay({ onContinue }) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:20,
      background:'rgba(0,0,0,0.85)', color:'#fff',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', textAlign:'center', padding:'2rem'
    }}>
      <h1 style={{marginBottom:'1rem'}}>⚠️ Read carefully</h1>
      <p style={{maxWidth:600, lineHeight:1.5}}>
        Welcome to my retro studio. Scroll slowly & interact with objects to discover my work.
      </p>
      <div style={{
        marginTop:'2rem', padding:'1rem 1.5rem', background:'#222',
        borderRadius:8, maxWidth:400
      }}>
        <h2>About Me</h2>
        <p>I’m Kejdi — front-end dev obsessed with WebGL, shaders and playful UX.</p>
      </div>
      <button
        style={{
          marginTop:'2rem', padding:'0.6rem 1.4rem',
          fontSize:16, background:'#ffcc44', border:'none',
          borderRadius:6, cursor:'pointer'
        }}
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  );
}

/* ─────────────────── Main App ─────────────────── */
export default function App() {
  const [stage, setStage] = useState(0);         // 0..3
  const [overlay, setOverlay] = useState(false); // About overlay open?
  const [lock, setLock] = useState(false);       // scroll locked?

  /* scroll thresholds */
  useEffect(() => {
    function onScroll() {
      if (lock) return;               // ignore while overlay up
      const y = window.scrollY;
      if (y > 150 && stage === 0) setStage(1);
      if (y > 450 && stage === 1) setStage(2);
      if (y > 800 && stage === 2) setStage(3);
    }
    addEventListener('scroll', onScroll);
    return () => removeEventListener('scroll', onScroll);
  }, [stage, lock]);

  /* open overlay the first time we hit stage-1 */
  useEffect(() => {
    if (stage === 1 && !overlay) {
      setOverlay(true);
      setLock(true);
      document.body.style.overflow = 'hidden';
    }
  }, [stage]);

  /* unlock scrolling when overlay dismissed */
  function closeOverlay() {
    setOverlay(false);
    setLock(false);
    document.body.style.overflow = 'auto';
    setStage(2);
  }

  return (
    <>
      <Canvas
        shadows
        gl={{ physicallyCorrectLights:true }}
        camera={{ position:[1.6,2.2,3.8], fov:60 }}
        style={{ width:'130vw', height:'120vh' }}
      >
        {/* lights */}
        <ambientLight intensity={0.25}/>
        <hemisphereLight skyColor={0xffffff} groundColor={0x444488} intensity={0.2}/>
        <directionalLight position={[5,10,5]} intensity={1.2} castShadow
          shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
        <pointLight position={[1.1,1.3,-0.3]} intensity={0.8} color={0xffcc88} distance={3}/>
        <Environment preset="studio"/>

        <CameraSpring stage={stage}/>

        <Suspense fallback={null}>
          <Room/>
          <GameBoyOnDesk
            visible={stage>=2}
            onButton={n=>n==='Button_A'&&setStage(3)}
          />
        </Suspense>
      </Canvas>

      {overlay && <AboutOverlay onContinue={closeOverlay}/>}
      {stage===3 && <FlappyBirdCanvas/>}
    </>
  );
}
