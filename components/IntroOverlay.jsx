import React, { useEffect, useState } from "react";

const IntroOverlay = React.memo(function IntroOverlay({
  visible,
  onDismiss,
  title = "⚠️ Read carefully",
  message = "Welcome to my retro studio. Scroll slowly & interact with objects to discover my work.",
  autoHideDelay = 5000,
  flashy = false,
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

  useEffect(() => {
    if (visible && autoHideDelay > 0) {
      const timer = setTimeout(onDismiss, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHideDelay, onDismiss]);

  if (animationState === "hidden") return null;

  const opacity = animationState === "visible" ? 1 : 0;

  return (
    <>
      {/* Full screen backdrop for flashy mode */}
      {flashy && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 14,
            background: "rgba(0, 0, 0, 0.8)",
            opacity,
            transition: "opacity 0.3s ease-in-out",
          }}
          onClick={onDismiss}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: flashy ? "50%" : "20px",
          left: "50%",
          transform: flashy ? "translate(-50%, -50%)" : "translateX(-50%)",
          zIndex: 15,
          background: flashy
            ? "linear-gradient(145deg, #000, #1a1a1a, #000)"
            : "rgba(0, 0, 0, 0.9)",
          color: flashy ? "#00ff41" : "#fff",
          padding: flashy ? "2.5rem 3rem" : "1.5rem 2rem",
          borderRadius: "0px",
          textAlign: flashy ? "left" : "center",
          maxWidth: "90vw",
          width: flashy ? "600px" : "500px",
          opacity,
          transition: "all 0.3s ease-in-out",
          backdropFilter: "blur(15px)",
          border: flashy
            ? "3px solid #00ff41"
            : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: flashy
            ? "0 0 30px rgba(0, 255, 65, 0.4), inset 0 0 20px rgba(0, 255, 65, 0.1)"
            : "0 8px 32px rgba(0, 0, 0, 0.3)",
          animation:
            flashy && animationState === "visible"
              ? "terminalGlow 2s ease-in-out infinite alternate"
              : "none",
          fontFamily: flashy ? "monospace" : "inherit",
          textShadow: flashy ? "0 0 10px #00ff41" : "none",
        }}
        onClick={onDismiss}
      >
        {flashy ? (
          // Retro terminal content
          <>
            {/* Terminal header */}
            <div
              style={{
                borderBottom: "1px solid #00ff41",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
                fontSize: "0.8rem",
                opacity: 0.8,
              }}
            >
              PORTFOLIO_ACCESS.EXE - [AUTHENTICATED]
            </div>

            {/* Terminal content */}
            <div style={{ lineHeight: "1.6" }}>
              <div
                style={{
                  marginBottom: "0.8rem",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                &gt; {title}
              </div>
              <div
                style={{ marginBottom: "1rem", fontSize: "1rem", opacity: 0.9 }}
              >
                &gt; {message}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.7,
                  fontStyle: "italic",
                  textAlign: "center",
                  marginTop: "1.5rem",
                  animation: "blink 1.5s infinite",
                }}
              >
                [SCROLL_TO_EXPLORE]
              </div>
            </div>

            {/* Scanlines effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.05) 2px, rgba(0,255,65,0.05) 4px)",
                pointerEvents: "none",
              }}
            />
          </>
        ) : (
          // Regular content for non-flashy mode
          <>
            <h2
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.2rem",
                fontWeight: "700",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: "0 0 1rem 0",
                lineHeight: 1.5,
                fontSize: "0.95rem",
                opacity: 0.9,
              }}
            >
              {message}
            </p>
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.6,
                fontStyle: "italic",
              }}
            >
              Click to dismiss or continue scrolling
            </div>
          </>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: ${
              flashy
                ? "translate(-50%, -50%) scale(1)"
                : "translateX(-50%) scale(1)"
            }; 
            box-shadow: ${
              flashy
                ? "0 20px 60px rgba(255, 204, 68, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                : "0 8px 32px rgba(0, 0, 0, 0.3)"
            };
          }
          50% { 
            transform: ${
              flashy
                ? "translate(-50%, -50%) scale(1.02)"
                : "translateX(-50%) scale(1.02)"
            }; 
            box-shadow: ${
              flashy
                ? "0 25px 80px rgba(255, 204, 68, 0.6), 0 0 0 2px rgba(255, 255, 255, 0.2)"
                : "0 12px 40px rgba(0, 0, 0, 0.4)"
            };
          }
        }
      `}</style>
    </>
  );
});

export default IntroOverlay;
