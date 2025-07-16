// src/App.jsx
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, SoftShadows, ContactShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  N8AO,
} from "@react-three/postprocessing";
import { KernelSize, BlendFunction } from "postprocessing";
import { useSpring } from "@react-spring/three";
import * as THREE from "three";
window.THREE = THREE; // dev convenience

// ──────────────────────────────────────── Internal components ──
import TweakCamera from "./TweakCamera";
import IntroCamHelper from "../components/IntroCamHelper";
import LogLights from "../components/LogLights";
import DeskProbe from "./DeskProbe";
import ScrollIntroManager from "../components/ScrollIntroManager";
import IntroOverlay from "../components/IntroOverlay";
import MonitorGuidance from "../components/MonitorGuidance";
import ScrollProgressIndicator from "../components/ScrollProgressIndicator";
import SnakeGame from "./SnakeGame";
import RetroMenu from "./RetroMenu";

/* ─────────── Camera spring ─────────── */
function CameraSpring({ stage }) {
  const { camera } = useThree();
  const { pos, tgt } = useSpring({
    pos:
      stage === 0
        ? [-9.1, 8.35, 9.53] // intro - wide view of studio
        : stage === 1
        ? [1.0, 5.0, 2.5] // slightly closer, but stay high
        : stage === 2
        ? [3.5, 5.5, 2.5] // closer to monitor, but still above
        : [2.5, 8.5, -1.5], // stay focused on monitor
    tgt:
      stage === 0
        ? [2, 3.0, -0.5] // looking at center of studio
        : stage === 1
        ? [2.0, 5.0, -5.0] // looking at studio center
        : stage === 2
        ? [3.5, 7.0, -3.5] // looking at monitor/desk area
        : [4.5, 8.0, -4.6], // keep looking at monitor area
    config: { mass: 2, tension: 120, friction: 40 },
  });
  useFrame(() => {
    camera.position.fromArray(pos.get());
    camera.lookAt(...tgt.get());
  });
  return null;
}

/* ─────────── Room model (0.015×) ─────────── */
const Room = React.forwardRef(function Room(_, ref) {
  const { scene } = useGLTF("/room_lowpoly.glb");

  // Convert MeshBasic → MeshLambert so lighting matters
  scene.traverse((obj) => {
    if (obj.isMesh && obj.material?.isMeshBasicMaterial) {
      const prev = obj.material;
      obj.material = new THREE.MeshLambertMaterial({
        map: prev.map,
        color: prev.color,
        vertexColors: prev.vertexColors,
      });
      prev.dispose();
    }
    if (obj.isLight) obj.intensity = 0; // disable baked lights
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.015}
      position={[0, 1, 0]} /* puts scaled floor at y = 0 */
      castShadow
      receiveShadow
    />
  );
});
useGLTF.preload("/room_lowpoly.glb");

/* ─────────── Overlay ─────────── */
function AboutOverlay({ onContinue }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>⚠️ Read carefully</h1>
      <p style={{ maxWidth: 600, lineHeight: 1.5 }}>
        Welcome to my retro studio. Scroll slowly & interact with objects to
        discover my work.
      </p>
      <button
        style={{
          marginTop: "2rem",
          padding: "0.6rem 1.4rem",
          fontSize: 16,
          background: "#ffcc44",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
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
  const [showSubtleWarning, setShowSubtleWarning] = useState(false);
  const [showIntroOverlay, setShowIntroOverlay] = useState(false);
  const [showMonitorGuidance, setShowMonitorGuidance] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showRetroMenu, setShowRetroMenu] = useState(false);
  const [lock, setLock] = useState(false);
  const roomRef = useRef();

  /* hide native scrollbars and prevent page scroll */
  useEffect(() => {
    const css = document.createElement("style");
    css.innerHTML =
      "body::-webkit-scrollbar{display:none;} body{scrollbar-width:none;-ms-overflow-style:none; overflow:hidden;}";
    document.head.appendChild(css);
    return () => document.head.removeChild(css);
  }, []);

  /* Handle wheel events for stage progression */
  useEffect(() => {
    let wheelAccumulator = 0;
    const wheelThreshold = 150; // More wheel movement needed per stage (less sensitive, more controlled)

    const handleWheel = (e) => {
      if (lock) return;

      e.preventDefault();
      wheelAccumulator += e.deltaY;

      // Stage progression based on wheel accumulation
      if (wheelAccumulator > wheelThreshold && stage < 3) {
        setStage(stage + 1);
        wheelAccumulator = (stage + 1) * wheelThreshold; // Set to current stage level
      } else if (wheelAccumulator < 0 && stage > 0) {
        setStage(stage - 1);
        wheelAccumulator = (stage - 1) * wheelThreshold; // Set to current stage level
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [stage, lock]);

  /* Handle stage changes and overlay visibility */
  useEffect(() => {
    // Stage 1: Subtle warning appears
    if (stage === 1 && !showSubtleWarning) {
      const timer = setTimeout(() => {
        setShowSubtleWarning(true);
      }, 400);
      return () => clearTimeout(timer);
    }

    // Stage 2: Flashy intro appears, subtle warning disappears
    if (stage === 2 && !showIntroOverlay) {
      setShowSubtleWarning(false);
      const timer = setTimeout(() => {
        setShowIntroOverlay(true);
      }, 600);
      return () => clearTimeout(timer);
    }

    // Stage 3: Monitor guidance appears, intro disappears
    if (stage === 3 && !showMonitorGuidance) {
      setShowIntroOverlay(false);
      const timer = setTimeout(() => {
        setShowMonitorGuidance(true);
      }, 800); // 800ms delay before monitor guidance appears
      return () => clearTimeout(timer);
    } else if (stage < 3) {
      setShowMonitorGuidance(false);
    }

    // Reset states when going back
    if (stage === 0) {
      setShowSubtleWarning(false);
      setShowIntroOverlay(false);
    }
  }, [stage, showSubtleWarning, showIntroOverlay]);

  const handleIntroOverlayDismiss = () => {
    setShowIntroOverlay(false);
  };

  return (
    <>
      <Canvas
        shadows
        gl={{
          physicallyCorrectLights: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.3, // slightly darker for drama
        }}
        camera={{ position: [-9.1, 8.35, 9.53], fov: 60 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* ——— DRAMATIC LIGHT RIG ——— */}
        <ambientLight intensity={0.01} color={0x2a2a3a} />

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

        <directionalLight
          position={[-5, 3, -3]}
          intensity={0.25}
          color={0x6699ff}
        />

        <pointLight
          position={[0.4, 1.2, 0.6]}
          color={0xff3366}
          intensity={0.8}
          distance={2.5}
        />
        <pointLight
          position={[0.2, 1.45, -0.4]}
          color={0x3388ff}
          intensity={1.8}
          distance={1.8}
        />
        <pointLight
          position={[-0.6, 1.0, 0.2]}
          color={0xffaa33}
          intensity={1.2}
          distance={1.5}
        />

        <pointLight
          position={[1.2, 0.8, -0.8]}
          color={0xff6600}
          intensity={0.6}
          distance={2}
        />
        <pointLight
          position={[-0.8, 1.8, 0.8]}
          color={0x9933ff}
          intensity={0.9}
          distance={2.2}
        />
        <spotLight
          position={[2, 3, 2]}
          target-position={[0, 0.5, 0]}
          angle={Math.PI / 6}
          penumbra={0.5}
          intensity={0.8}
          color={0xffffff}
          castShadow
        />

        {/* Post‑processing */}
        <EffectComposer multisampling={2}>
          <N8AO aoRadius={0.2} intensity={15} />
          <Bloom
            intensity={0.9}
            kernelSize={KernelSize.MEDIUM}
            luminanceThreshold={0.6}
          />
          <Vignette
            eskil={false}
            offset={0.15}
            darkness={1.2}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>

        {/* Shadows */}
        <SoftShadows size={100} focus={0.8} samples={25} />
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.75}
          scale={3}
          blur={2.5}
          far={2.5}
        />

        {/* camera & helpers */}
        <CameraSpring stage={stage} />
        {import.meta.env.DEV && <LogLights />}

        {/* scene */}
        <Suspense fallback={null}>
          <Room ref={roomRef} />
          {import.meta.env.DEV && <DeskProbe target={roomRef} />}
        </Suspense>
      </Canvas>

      {/* Scroll management */}
      <ScrollIntroManager
        stage={stage}
        onStageChange={setStage}
        lockScroll={lock}
        setLockScroll={setLock}
      />

      {/* Overlays */}
      {showSubtleWarning && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            right: "30px",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            padding: "0.8rem 1.2rem",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "0.9rem",
            opacity: 0.8,
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          ⚠️ Something is coming...
        </div>
      )}

      <IntroOverlay
        visible={showIntroOverlay}
        onDismiss={handleIntroOverlayDismiss}
        flashy={true}
      />

      {/* Bottom retro message */}
      {showMonitorGuidance && !gameCompleted && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 12,
            background: "linear-gradient(45deg, #000, #111)",
            color: "#0f0",
            padding: "1rem 2rem",
            borderRadius: "8px",
            textAlign: "center",
            maxWidth: "90vw",
            width: "400px",
            border: "2px solid #0f0",
            boxShadow:
              "0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.1)",
            fontSize: "1rem",
            fontWeight: "bold",
            fontFamily: "monospace",
            textShadow: "0 0 10px #0f0",
            backdropFilter: "blur(10px)",
          }}
        >
          👆 Focus on the monitor area to explore my work!
        </div>
      )}

      {/* Play button on monitor screen */}
      {showMonitorGuidance && !gameCompleted && (
        <button
          onClick={() => setShowSnakeGame(true)}
          style={{
            position: "fixed",
            top: "52%", // A bit more down
            left: "57%", // More to the right
            transform: "translate(-50%, -50%)",
            zIndex: 12,
            background: "#000",
            color: "#0f0",
            border: "2px solid #0f0",
            padding: "0.8rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            fontFamily: "monospace",
            boxShadow: "0 0 10px rgba(0, 255, 0, 0.3)",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#0f0";
            e.target.style.color = "#000";
            e.target.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.6)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#000";
            e.target.style.color = "#0f0";
            e.target.style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.3)";
          }}
        >
          🐍 PLAY SNAKE
        </button>
      )}

      {/* Progress indicator */}
      <ScrollProgressIndicator
        currentStage={stage}
        totalStages={4}
        stageNames={["Start", "Warning", "Intro", "Monitor"]}
      />

      {/* Snake Game */}
      {showSnakeGame && (
        <SnakeGame
          onComplete={() => {
            setGameCompleted(true);
            setShowSnakeGame(false);
            setShowRetroMenu(true);
          }}
          onClose={() => setShowSnakeGame(false)}
        />
      )}

      {/* Retro Menu */}
      {showRetroMenu && (
        <RetroMenu
          visible={showRetroMenu}
          onClose={() => setShowRetroMenu(false)}
        />
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 0.8; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
