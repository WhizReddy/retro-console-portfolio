import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  Environment,
  SoftShadows,
  ContactShadows
} from '@react-three/drei';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';
window.THREE = THREE;
import FlappyBirdCanvas from './FlappyBirdCanvas';
import GameBoyOnDesk    from './GameBoyOnDesk';
import TweakCamera      from './TweakCamera';
import IntroCamHelper   from '../components/IntroCamHelper';
import LogLights from '../components/LogLights';
import { EffectComposer, Bloom, SSAO, Vignette } from '@react-three/postprocessing';
import { KernelSize, BlendFunction } from 'postprocessing';


/* ─────────── Camera spring ─────────── */
function CameraSpring({ stage }) {
  const { camera } = useThree();
  const { pos, tgt } = useSpring({
    pos:  stage === 0 ? [2, 4, 6]
         : stage === 1 ? [2.0, 5.0, 3.2]
         : stage === 2 ? [4.0, 5.0, 1.8]
         :               [1.0, 2.0, 3.0],
    tgt:  stage === 0 ? [0.8, 1.5, 0]
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

/* ─────────── Room model (scaled 0.015×) ─────────── */
function Room() {
  const { scene } = useGLTF('/room_lowpoly.glb');

  /* turn off every light that came with the model */
  scene.traverse(o => {
    if (o.isLight) o.intensity = 0;
  });

  return (
    <primitive
      object={scene}
      scale={0.015}
      position={[0, 1, 0]}
      receiveShadow
    />
  );
}

useGLTF.preload('/room_lowpoly.glb');

/* ─────────── Overlay ─────────── */
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

/* ─────────── Main ─────────── */
export default function App() {
  const [stage, setStage] = useState(0);
  const [overlay, setOvl] = useState(false);
  const [lock, setLock]   = useState(false);

  /* hide OS scroll-bars */
  useEffect(() => {
    const css = document.createElement('style');
    css.innerHTML = `
      body::-webkit-scrollbar{display:none;}
      body{ scrollbar-width:none; -ms-overflow-style:none; }
    `;
    document.head.appendChild(css);
    return () => document.head.removeChild(css);
  }, []);

  /* scroll thresholds */
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
        setOvl(true);
        setLock(true);
        document.body.style.overflow = 'hidden';
      }, 600);
      return () => clearTimeout(id);
    }
  }, [stage, overlay]);

  const closeOverlay = () => {
    setOvl(false);
    setLock(false);
    document.body.style.overflow = 'auto';
    setStage(2);
  };

  return (
    <>
<Canvas
  shadows
  gl={{
    physicallyCorrectLights: true,
    toneMappingExposure: 0.4,     // ↓ overall brightness
  }}
  camera={{ position: [2, 4, 6], fov: 60 }}
  style={{ width: '100vw', height: '100vh' }}
>
  {/* ───── REALLY DIM RIG ───── */}
  {/* Ambient just to keep total black away */}
  <ambientLight intensity={0.03} color={0xffffff} />

  {/* Key + shadows – half the power it had */}
  <pointLight
    position={[ 0.4, 1.2,  0.6]}  // lava-lamp
    color={0xff6699}
    intensity={0.4}
    distance={3}
  />
  <pointLight
    position={[ 0.2, 1.45,-0.4]}  // monitor glow
    color={0x99ccff}
    intensity={1.2}
    distance={2}
  />
  <pointLight
    position={[-0.6, 1.0, 0.2]}   // desk lamp
    color={0xffddaa}
    intensity={0.7}
    distance={2}
  />
{import.meta.env.DEV && <LogLights />}
  {/* ───── Post-processing ───── */}
  {/* subtle ambient-occlusion so crevices darken */} 
<EffectComposer multisampling={1}>
    {/* subtle ambient-occlusion so crevices darken */}
    <SSAO
      radius={-0.15}
      intensity={-2}
      luminanceInfluence={-0.2}
      color="black"
    />

    {/* monitor & lamp bloom */}
    <Bloom
      intensity={-0.1}
      kernelSize={KernelSize.SMALL}
      luminanceThreshold={-0.1}
      luminanceSmoothing={-0.1}
      height={200}
    />

    {/* darkens corners, focuses eye */}
    <Vignette
      eskil={false}
      offset={-0.1}
      darkness={0.2}
      blendFunction={BlendFunction.NORMAL}
    />
  </EffectComposer>

        {/* low ambient so shadows read as dark */}
        <ambientLight intensity={1} />

        {/* soft global environment reflections */}
        <Environment
  preset="studio"
  intensity={0.25}     // ↓ overall bounce light
  background={false}   // keep black backdrop so nothing glows
/>
        {/* soft-shadow post-blur */}
        <SoftShadows size={100} focus={0.5} samples={20} />

        {/* subtle contact shadow under objects */}
        <ContactShadows
          position={[1, 1, 1]}
          opacity={0.2}
          scale={1}
          blur={2}
          far={1}
        />

        <CameraSpring stage={stage} />

        {import.meta.env.DEV && stage===0 && (
          <>
            <TweakCamera />
            <IntroCamHelper />
          </>
        )}

        <Suspense fallback={null}>
          <Room />
          <GameBoyOnDesk
            visible={stage>=2}
            onButton={(n)=>n==='Button_A'&&setStage(3)}
          />
        </Suspense>
      </Canvas>

      {overlay && <AboutOverlay onContinue={closeOverlay}/>}
      {stage===3 && <FlappyBirdCanvas/>}
    </>
  );
}
