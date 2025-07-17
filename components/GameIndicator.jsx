import React, { useState } from 'react';
import { Html } from '@react-three/drei';

export default function GameIndicator({ 
  position = [0, 0, 0], 
  onPlay, 
  emoji = '🎮' 
}) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <Html position={position}>
      <div
        style={{
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
          fontSize: hovered ? '3rem' : '2.5rem',
          userSelect: 'none',
          transition: 'all 0.3s ease',
          animation: 'float 3s ease-in-out infinite',
          filter: `drop-shadow(0 0 ${hovered ? '10px' : '5px'} rgba(0, 255, 65, ${hovered ? '0.8' : '0.5'}))`,
        }}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {emoji}
        
        {/* CSS animations */}
        <style>{`
          @keyframes float {
            0%, 100% { 
              transform: translate(-50%, -50%) translateY(0px); 
            }
            50% { 
              transform: translate(-50%, -50%) translateY(-10px); 
            }
          }
        `}</style>
      </div>
    </Html>
  );
}