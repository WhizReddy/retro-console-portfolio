// src/App.jsx
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  Environment,
  SoftShadows,
  ContactShadows
} from '@react-three/drei';
import { EffectComposer, SSAO, Bloom, Vignette, N8AO } from '@react-three/postprocessing';
import { KernelSize, BlendFunction } from 'postprocessing';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';
window.THREE = THREE;                 // (dev convenience)

import FlappyBirdCanvas from './FlappyBirdCanvas';
import GameBoyOnDesk    from './GameBoyOnDesk';
import TweakCamera      from './TweakCamera';
import IntroCamHelper   from '../components/IntroCamHelper';
import LogLights        from '../components/LogLights';

/* ─────────── Camera spring ─────────── */
function CameraSpring({ stage }) {
  const { camera } = useThree();
  const { pos, tgt } = useSpring({
    pos:  stage === 0 ?[-9.10, 8.35, 9.53]  // Updated from IntroCam values
         : stage === 1 ? [2.0, 5.0, 3.2]
         : stage === 2 ? [4.0, 5.0, 1.8]
         :               [1.0, 2.0, 3.0],
    tgt:  stage === 0 ?  [ 0.53, 5.00, -0.5]  // Updated target from IntroCam
         : stage === 1 ? [2.0, 5.0, 1.0]
         : stage === 2 ? [1.1, 4.0, 0.2]
         :               [1.11, 5.0, 2.0],
    config: { mass: 2, tension: 120, friction: 40 }
  });
  useFrame(() => {
    camera.position.fromArray(pos.get());
    camera.lookAt(...tgt.get());
  });
  return null;
}

/* ─────────── Room model (0.015×) ─────────── */
function Room() {
  const { scene } = useGLTF('/room_lowpoly.glb');

  /* Convert un-lit MeshBasic → MeshLambert so lighting matters */
  scene.traverse(obj => {
    if (obj.isMesh && obj.material?.isMeshBasicMaterial) {
      const prev = obj.material;
      obj.material = new THREE.MeshLambertMaterial({
        map: prev.map,
        color: prev.color,
        vertexColors: prev.vertexColors,
      });
      prev.dispose();
    }
    if (obj.isLight) obj.intensity = 0;   // disable baked lights, if any
  });

  return (
    <primitive
      object={scene}
      scale={0.015}
      position={[0, 1, 0]}   /* puts scaled floor at y = 0 */
      castShadow
      receiveShadow
    />
  );
}
useGLTF.preload('/room_lowpoly.glb');

/* ─────────── Overlay ─────────── */
function AboutOverlay({ onContinue }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20,
      background: 'rgba(0,0,0,0.85)', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '2rem'
    }}>
      <h1 style={{ marginBottom: '1rem' }}>⚠️ Read carefully</h1>
      <p style={{ maxWidth: 600, lineHeight: 1.5 }}>
        Welcome to my retro studio. Scroll slowly & interact with objects to discover my work.
      </p>
      <button
        style={{
          marginTop: '2rem', padding: '0.6rem 1.4rem',
          fontSize: 16, background: '#ffcc44', border: 'none',
          borderRadius: 6, cursor: 'pointer'
        }}
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  );
}

/* ─────────── Main ─────────── */
export default function App() {
  const [stage, setStage] = useState(0);
  const [overlay, setOvl] = useState(false);
  const [lock, setLock]   = useState(false);

  /* hide native scrollbars */
  useEffect(() => {
    const css = document.createElement('style');
    css.innerHTML = `body::-webkit-scrollbar{display:none;} body{scrollbar-width:none;-ms-overflow-style:none}`;
    document.head.appendChild(css);
    return () => document.head.removeChild(css);
  }, []);

  /* stage scroll thresholds */
  useEffect(() => {
    const onScroll = () => {
      if (lock) return;
      const y = scrollY;
      if (y > 150  && stage === 0) setStage(1);
      if (y > 600  && stage === 1 && !overlay) setStage(2);
      if (y > 1000 && stage === 2) setStage(3);
    };
    addEventListener('scroll', onScroll);
    return () => removeEventListener('scroll', onScroll);
  }, [stage, lock, overlay]);

  /* overlay trigger */
  useEffect(() => {
    if (stage === 1 && !overlay) {
      const id = setTimeout(() => {
        setOvl(true); setLock(true);
        document.body.style.overflow = 'hidden';
      }, 600);
      return () => clearTimeout(id);
    }
  }, [stage, overlay]);

  const closeOverlay = () => {
    setOvl(false); setLock(false);
    document.body.style.overflow = 'auto';
    setStage(2);
  };

  return (
    <>
      <Canvas
        shadows
        gl={{
          physicallyCorrectLights: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.3  // Slightly darker for more drama
        }}
        camera={{ position: [-9.1, 8.35, 9.53], fov: 60 }}  // Updated initial camera position from new IntroCam
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* ——— DRAMATIC LIGHT RIG ——— */}
        <ambientLight intensity={0.01} color={0x2a2a3a} />  {/* Darker, cooler ambient */}
        
        {/* Main key light - stronger and more directional */}
        <directionalLight
          position={[8, 10, 6]}
          intensity={0.6}
          color={0xf0f0ff}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-near={0.01}
          shadow-camera-far={8}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
        />
        
        {/* Dramatic rim light */}
        <directionalLight
          position={[-5, 3, -3]}
          intensity={0.25}
          color={0x6699ff}
        />
        
        {/* Enhanced colored practicals */}
        <pointLight position={[ 0.4, 1.2,  0.6]} color={0xff3366} intensity={0.8} distance={2.5}/>
        <pointLight position={[ 0.2, 1.45,-0.4]} color={0x3388ff} intensity={1.8} distance={1.8}/>
        <pointLight position={[-0.6, 1.0,  0.2]} color={0xffaa33} intensity={1.2} distance={1.5}/>
        
        {/* Additional dramatic accent lights */}
        <pointLight position={[ 1.2, 0.8, -0.8]} color={0xff6600} intensity={0.6} distance={2}/>
        <pointLight position={[-0.8, 1.8,  0.8]} color={0x9933ff} intensity={0.9} distance={2.2}/>
        <spotLight
          position={[2, 3, 2]}
          target-position={[0, 0.5, 0]}
          angle={Math.PI / 6}
          penumbra={0.5}
          intensity={0.8}
          color={0xffffff}
          castShadow
        />

        {/* Enhanced post-processing for drama */}
        <EffectComposer multisampling={2}>
          <N8AO aoRadius={0.2} intensity={15} />
          <Bloom intensity={0.9} kernelSize={KernelSize.MEDIUM} luminanceThreshold={0.6} />
          <Vignette eskil={false} offset={0.15} darkness={1.2} blendFunction={BlendFunction.NORMAL}/>
        </EffectComposer>

        {/* Enhanced shadows for drama */}
        <SoftShadows size={100} focus={0.8} samples={25} />
        <ContactShadows position={[0,0.01,0]} opacity={0.75} scale={3} blur={2.5} far={2.5}/>

        {/* camera & helpers */}
        <CameraSpring stage={stage}/>
        {/* Temporarily disable these to test camera control */}
        {/* {import.meta.env.DEV && stage===0 && (<><TweakCamera/><IntroCamHelper/></>)} */}
        {import.meta.env.DEV && <LogLights />}

        {/* scene */}
        <Suspense fallback={null}>
          <Room />
          <GameBoyOnDesk
            visible={stage>=2}
            onButton={(n)=> n==='Button_A' && setStage(3)}
          />
        </Suspense>
      </Canvas>

      {overlay && <AboutOverlay onContinue={closeOverlay}/>}
      {stage===3 && <FlappyBirdCanvas/>}
    </>
  );
}