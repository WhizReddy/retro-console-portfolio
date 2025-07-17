import React, { useState, useEffect } from 'react';

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide timer after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Hide on scroll event
    const handleScroll = () => {
      setVisible(false);
    };

    // Hide on wheel event (since the app uses wheel for navigation)
    const handleWheel = () => {
      setVisible(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        color: '#00ff41',
        textAlign: 'center',
        fontFamily: 'monospace',
        animation: 'bounce 2s infinite',
        textShadow: '0 0 10px #00ff41',
        filter: 'drop-shadow(0 0 8px rgba(0, 255, 65, 0.6))',
      }}
    >
      {/* Bouncing arrow */}
      <div style={{ 
        fontSize: '2rem', 
        marginBottom: '5px',
        fontWeight: 'bold'
      }}>
        ↓
      </div>
      
      {/* Instruction text */}
      <div style={{ 
        fontSize: '0.8rem',
        letterSpacing: '1px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #00ff41',
        boxShadow: '0 0 15px rgba(0, 255, 65, 0.3)',
      }}>
        SCROLL TO EXPLORE
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { 
            transform: translateY(0) translateX(-50%); 
          }
          40% { 
            transform: translateY(-10px) translateX(-50%); 
          }
          60% { 
            transform: translateY(-5px) translateX(-50%); 
          }
        }
      `}</style>
    </div>
  );
}