import React, { useState, useEffect } from "react";
import audioManager from "./AudioManager";

const MENU_ITEMS = [
  {
    id: "about",
    title: "👤 ABOUT ME",
    content: {
      title: "ABOUT ME",
      description: "Full-Stack Developer & Creative Technologist",
      details: [
        "🎯 Passionate about creating immersive digital experiences",
        "💻 Specializing in React, Three.js, and modern web technologies",
        "🎨 Combining technical skills with creative vision",
        "🚀 Always exploring new technologies and pushing boundaries",
        "🎮 Love for retro aesthetics and interactive design",
      ],
    },
  },
  {
    id: "projects",
    title: "🚀 PROJECTS",
    content: {
      title: "MY PROJECTS",
      description: "Featured Work & Creations",
      details: [
        "🌐 3D Portfolio Website - Interactive retro studio experience",
        "🎮 Retro Game Collection - Classic games with modern twist",
        "🎨 Creative Coding - Generative art and animations",
        "🔧 Open Source Tools - Developer utilities and libraries",
        "👨🏻‍💻 CRM",
      ],
    },
  },
  {
    id: "skills",
    title: "⚡ SKILLS",
    content: {
      title: "TECHNICAL SKILLS",
      description: "Technologies & Expertise",
      details: [
        "🔥 Frontend: React, Three.js, JavaScript, TypeScript",
        "⚙️ Backend: Node.js, Mongoose, APIs, Databases",
        "🎨 Design: 3D Modeling, Creative Coding",
        "🛠️ Tools: Git, Docker, CI/CD, Testing Frameworks",
        "🧠 Concepts: WebGL, Game Development, Performance Optimization",
      ],
    },
  },
];

export default function RetroMenu({ visible, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [animationState, setAnimationState] = useState("hidden");

  useEffect(() => {
    if (visible) {
      setAnimationState("entering");
      const timer = setTimeout(() => setAnimationState("visible"), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationState("exiting");
      const timer = setTimeout(() => setAnimationState("hidden"), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!visible) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (showDetails) return;
          audioManager.playSound("menuMove"); // Play navigation sound
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : MENU_ITEMS.length - 1
          );
          break;
        case "ArrowDown":
          e.preventDefault();
          if (showDetails) return;
          audioManager.playSound("menuMove"); // Play navigation sound
          setSelectedIndex((prev) =>
            prev < MENU_ITEMS.length - 1 ? prev + 1 : 0
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          audioManager.playSound("menuSelect"); // Play selection sound
          if (showDetails) {
            setShowDetails(false);
          } else {
            setShowDetails(true);
          }
          break;
        case "Escape":
          e.preventDefault();
          if (showDetails) {
            setShowDetails(false);
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [visible, showDetails, onClose]);

  if (animationState === "hidden") return null;

  const opacity = animationState === "visible" ? 1 : 0;
  const selectedItem = MENU_ITEMS[selectedIndex];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 25,
        background: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0f0",
        fontFamily: "monospace",
        opacity,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #000, #111)",
          border: "3px solid #0f0",
          borderRadius: "15px",
          padding: "3rem",
          maxWidth: "90vw",
          width: "800px", // Bigger display as requested
          maxHeight: "90vh",
          boxShadow:
            "0 0 30px rgba(0, 255, 0, 0.4), inset 0 0 20px rgba(0, 255, 0, 0.1)",
          backdropFilter: "blur(10px)",
          overflow: "auto",
        }}
      >
        {!showDetails ? (
          // Main Menu
          <div>
            <h1
              style={{
                textAlign: "center",
                margin: "0 0 2rem 0",
                fontSize: "2.5rem",
                textShadow: "0 0 20px #0f0, 0 0 40px #0f0",
                letterSpacing: "3px",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              ⚡ MAIN MENU ⚡
            </h1>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <p
                style={{
                  color: "#ccc",
                  fontSize: "1.1rem",
                  margin: "0 0 0.5rem 0",
                }}
              >
                🎉 CONGRATULATIONS! SNAKE COMPLETED! 🎉
              </p>
              <p style={{ color: "#888", fontSize: "0.9rem" }}>
                Use ↑↓ arrows to navigate • ENTER to select • ESC to exit
              </p>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {MENU_ITEMS.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: "1.5rem 2rem",
                    border:
                      selectedIndex === index
                        ? "2px solid #0f0"
                        : "2px solid #333",
                    borderRadius: "10px",
                    background:
                      selectedIndex === index
                        ? "linear-gradient(45deg, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05))"
                        : "rgba(0, 0, 0, 0.3)",
                    textAlign: "center",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow:
                      selectedIndex === index
                        ? "0 0 15px rgba(0, 255, 0, 0.3)"
                        : "none",
                    transform:
                      selectedIndex === index ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {selectedIndex === index && "▶ "}
                  {item.title}
                  {selectedIndex === index && " ◀"}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Details View
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "2rem",
                  textShadow: "0 0 15px #0f0",
                  margin: "0 0 0.5rem 0",
                  letterSpacing: "2px",
                }}
              >
                {selectedItem.content.title}
              </h2>
              <p
                style={{
                  color: "#ccc",
                  fontSize: "1.2rem",
                  fontStyle: "italic",
                  margin: "0 0 1rem 0",
                }}
              >
                {selectedItem.content.description}
              </p>
              <div
                style={{
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, #0f0, transparent)",
                  margin: "1rem 0",
                }}
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              {selectedItem.content.details.map((detail, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0.8rem 1.5rem",
                    margin: "0.5rem 0",
                    background: "rgba(0, 255, 0, 0.05)",
                    border: "1px solid rgba(0, 255, 0, 0.2)",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    lineHeight: "1.4",
                    borderLeft: "4px solid #0f0",
                  }}
                >
                  {detail}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: "linear-gradient(45deg, #0f0, #0a0)",
                  color: "#000",
                  border: "2px solid #0f0",
                  padding: "1rem 2rem",
                  fontSize: "1.1rem",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: "0 0 15px rgba(0, 255, 0, 0.5)",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 0 20px rgba(0, 255, 0, 0.8)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.5)";
                }}
              >
                ← BACK TO MENU
              </button>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "transparent",
            color: "#666",
            border: "1px solid #666",
            padding: "0.5rem",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          ✕
        </button>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 20px #0f0, 0 0 40px #0f0;
          }
          to {
            text-shadow: 0 0 30px #0f0, 0 0 60px #0f0, 0 0 80px #0f0;
          }
        }
      `}</style>
    </div>
  );
}
