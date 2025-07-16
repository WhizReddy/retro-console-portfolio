import React, { useEffect, useState } from "react";

const MonitorGuidance = React.memo(function MonitorGuidance({
  visible,
  message = "👆 Focus on the monitor area to explore my work!",
  position = "bottom-center",
  onPlayClick,
  showPlayButton = false,
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
          left: "55%",
          transform: `translate(-50%, -50%) scale(${scale})`,
        };
      case "monitor-screen":
        return {
          top: "50%",
          left: "55%", // Moved a bit more left
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

        {/* Play Button */}
        {showPlayButton && (
          <button
            onClick={onPlayClick}
            style={{
              marginTop: "2rem",
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
