import React, { useEffect, useState } from 'react';

export default function MatrixCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Reduced trail points for better performance
      setTrails(prev => {
        const newTrail = {
          x: e.clientX,
          y: e.clientY,
          id: Date.now() + Math.random(),
          opacity: 1,
          size: 1
        };
        
        // Keep only last 6 trail points for better performance
        const updatedTrails = [newTrail, ...prev.slice(0, 5)];
        return updatedTrails;
      });

      // Reduced particle generation for better performance
      if (Math.random() < 0.1) {
        const newParticle = {
          x: e.clientX + (Math.random() - 0.5) * 40,
          y: e.clientY + (Math.random() - 0.5) * 40,
          id: Date.now() + Math.random(),
          char: String.fromCharCode(0x30A0 + Math.random() * 96),
          opacity: 1,
          velocity: { x: (Math.random() - 0.5) * 1, y: Math.random() * 1 + 0.5 }
        };
        
        setParticles(prev => [newParticle, ...prev.slice(0, 8)]);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Reduced animation frequency for better performance
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => 
        prev.map((trail, index) => ({
          ...trail,
          opacity: Math.max(0, 1 - (index * 0.15)),
          size: Math.max(0.3, 1 - (index * 0.1))
        })).filter(trail => trail.opacity > 0.2)
      );

      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          opacity: Math.max(0, particle.opacity - 0.08),
          velocity: {
            x: particle.velocity.x * 0.95,
            y: particle.velocity.y + 0.05
          }
        })).filter(particle => particle.opacity > 0.2)
      );
    }, 32); // 30fps instead of 60fps for better performance

    return () => clearInterval(interval);
  }, []);

  return (
    <>


      {/* Matrix particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            color: '#00ff41',
            fontSize: '12px',
            fontFamily: 'monospace',
            pointerEvents: 'none',
            zIndex: 9998,
            opacity: particle.opacity,
            textShadow: `0 0 5px #00ff41`,
            animation: 'matrixGlitch 0.5s infinite',
          }}
        >
          {particle.char}
        </div>
      ))}

      {/* Enhanced cursor trails with black hole distortion */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          style={{
            position: 'fixed',
            left: trail.x - (4 * trail.size),
            top: trail.y - (4 * trail.size),
            width: `${8 * trail.size}px`,
            height: `${8 * trail.size}px`,
            background: `radial-gradient(circle, #00ff41 0%, rgba(0, 255, 65, 0.8) 30%, rgba(0, 255, 65, 0.4) 60%, transparent 100%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: trail.opacity,
            boxShadow: `0 0 ${10 * trail.size}px rgba(0, 255, 65, ${trail.opacity})`,
            transform: `scale(${trail.size}) rotate(${index * 30}deg)`,
            transition: 'opacity 0.1s ease-out',
          }}
        />
      ))}
      
      {/* Main cursor with enhanced black hole effect */}
      <div
        style={{
          position: 'fixed',
          left: mousePos.x - 8,
          top: mousePos.y - 8,
          width: '16px',
          height: '16px',
          background: `radial-gradient(circle, #000 0%, #00ff41 30%, rgba(0, 255, 65, 0.8) 60%, transparent 100%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
          boxShadow: `
            0 0 20px #00ff41,
            inset 0 0 10px #000,
            0 0 40px rgba(0, 255, 65, 0.5)
          `,
          animation: 'blackHolePulse 2s infinite, blackHoleRotate 4s linear infinite',
          transform: `scale(${isClicking ? 1.3 : 1})`,
          transition: 'transform 0.2s ease',
        }}
      />

      {/* Outer ring effect */}
      <div
        style={{
          position: 'fixed',
          left: mousePos.x - 15,
          top: mousePos.y - 15,
          width: '30px',
          height: '30px',
          border: '1px solid rgba(0, 255, 65, 0.3)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          animation: 'ringPulse 1.5s infinite',
          opacity: isClicking ? 1 : 0.6,
        }}
      />

      {/* CSS animations */}
      <style>{`
        * {
          cursor: none !important;
        }
        
        @keyframes blackHolePulse {
          0%, 100% { 
            box-shadow: 
              0 0 20px #00ff41,
              inset 0 0 10px #000,
              0 0 40px rgba(0, 255, 65, 0.5);
          }
          50% { 
            box-shadow: 
              0 0 30px #00ff41,
              inset 0 0 15px #000,
              0 0 60px rgba(0, 255, 65, 0.8);
          }
        }
        
        @keyframes blackHoleRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ringPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes matrixGlitch {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
        
        @keyframes blackHoleDistortion {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(0.9); }
          75% { transform: rotate(270deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes blackHoleCore {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 255, 65, 0.2);
          }
          50% { 
            transform: rotate(180deg) scale(1.1);
            box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 255, 65, 0.4);
          }
        }
      `}</style>
    </>
  );
}