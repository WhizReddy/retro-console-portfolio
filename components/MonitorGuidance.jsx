import React, { useEffect, useState } from "react";

const MonitorGuidance = React.memo(function MonitorGuidance({
  visible,
  message = "👆 Focus on the monitor area to explore my work!",
  position = "bottom-center",
}) {
  const [animationState, setAnimationState] = useState("hidden");

  useEffect(() => {
    if (visible) {
      setAnimationState("entering");
      const timer = setTimeout(() => setAnimationState("visible"), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimationState("exiting");
      const timer = setTimeout(() => setAnimationState("hidden"), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (animationState === "hidden") return null;

  const opacity = animationState === "visible" ? 1 : 0;
  const scale = animationState === "visible" ? 1 : 0.9;

  // Position styles based on prop
  const getPositionStyles = () => {
    switch (position) {
      case "bottom-center":
        return {
          bottom: "80px",
          left: "50%",
          transform: `translateX(-50%) scale(${scale})`,
        };
      case "center":
        return {
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
        };
      default:
        return {
          bottom: "80px",
          left: "50%",
          transform: `translateX(-50%) scale(${scale})`,
        };
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          zIndex: 12,
          background: "rgba(255, 204, 68, 0.95)",
          color: "#000",
          padding: "1rem 1.5rem",
          borderRadius: "25px",
          textAlign: "center",
          maxWidth: "90vw",
          width: "300px",
          opacity,
          transition: "all 0.3s ease-in-out",
          backdropFilter: "blur(5px)",
          border: "2px solid rgba(255, 204, 68, 1)",
          boxShadow: "0 4px 20px rgba(255, 204, 68, 0.3)",
          fontSize: "1rem",
          fontWeight: "600",
          ...getPositionStyles(),
        }}
      >
        {message}

        {/* Animated arrow pointing up */}
        <div
          style={{
            position: "absolute",
            top: "-15px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "2rem",
          }}
        >
          ☝️
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: ${opacity}; }
          50% { opacity: ${opacity * 0.8}; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </>
  );
});

export default MonitorGuidance;
