import React, { useEffect, useState } from "react";

const MatrixCorners = () => {
  const [matrixChars, setMatrixChars] = useState([]);

  // Generate matrix characters for each corner
  useEffect(() => {
    const generateMatrixChars = () => {
      const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
      const newChars = [];

      corners.forEach((corner, cornerIndex) => {
        // Generate 8-12 characters per corner
        const charCount = Math.floor(Math.random() * 5) + 8;

        for (let i = 0; i < charCount; i++) {
          newChars.push({
            id: `${corner}-${i}`,
            corner,
            char: String.fromCharCode(0x30a0 + Math.random() * 96), // Katakana characters
            x: Math.random() * 150, // Position within 150px corner area
            y: Math.random() * 150,
            opacity: Math.random() * 0.01 + 0.04, // Very low opacity (0.1-0.4)
            size: Math.random() * 3 + 1, // Font size 10-18px
            animationDelay: Math.random() * 2, // Stagger animations
            animationDuration: Math.random() * 3 + 2, // 3-7 second cycles
          });
        }
      });

      setMatrixChars(newChars);
    };

    generateMatrixChars();

    // Regenerate characters every 10 seconds for variety
    const interval = setInterval(generateMatrixChars, 10000);
    return () => clearInterval(interval);
  }, []);

  const getCornerStyle = (corner) => {
    const baseStyle = {
      position: "absolute",
      width: "10px",
      height: "10px",
      pointerEvents: "none",
      overflow: "hidden",
    };

    switch (corner) {
      case "top-left":
        return { ...baseStyle, top: 0, left: 0 };
      case "top-right":
        return { ...baseStyle, top: 0, right: 0 };
      case "bottom-left":
        return { ...baseStyle, bottom: 0, left: 0 };
      case "bottom-right":
        return { ...baseStyle, bottom: 0, right: 0 };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1, // Very low z-index so it stays behind everything
        pointerEvents: "none",
      }}
    >
      {/* Render each corner */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map(
        (corner) => (
          <div key={corner} style={getCornerStyle(corner)}>
            {matrixChars
              .filter((char) => char.corner === corner)
              .map((char) => (
                <div
                  key={char.id}
                  style={{
                    position: "absolute",
                    left: `${char.x}px`,
                    top: `${char.y}px`,
                    color: "#00ff41",
                    fontSize: `${char.size}px`,
                    fontFamily: "monospace",
                    opacity: char.opacity,
                    textShadow: "0 0 5px #00ff41",
                    animation: `matrixFloat ${char.animationDuration}s ease-in-out infinite`,
                    animationDelay: `${char.animationDelay}s`,
                    userSelect: "none",
                  }}
                >
                  {char.char}
                </div>
              ))}
          </div>
        )
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes matrixFloat {
          0%,
          100% {
            opacity: 0.1;
            transform: translateY(0px) scale(1);
          }
          25% {
            opacity: 0.4;
            transform: translateY(-5px) scale(1.1);
          }
          50% {
            opacity: 0.2;
            transform: translateY(0px) scale(0.9);
          }
          75% {
            opacity: 0.3;
            transform: translateY(3px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default MatrixCorners;
