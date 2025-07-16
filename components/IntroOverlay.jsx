import React, { useEffect, useState } from 'react';

const IntroOverlay = React.memo(function IntroOverlay({ 
  visible, 
  onDismiss, 
  title = "⚠️ Read carefully",
  message = "Welcome to my retro studio. Scroll slowly & interact with objects to discover my work.",
  autoHideDelay = 5000,
  flashy = false
}) {
  const [animationState, setAnimationState] = useState('hidden');

  useEffect(() => {
    if (visible) {
      setAnimationState('entering');
      const timer = setTimeout(() => setAnimationState('visible'), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('exiting');
      const timer = setTimeout(() => setAnimationState('hidden'), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && autoHideDelay > 0) {
      const timer = setTimeout(onDismiss, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHideDelay, onDismiss]);

  if (animationState === 'hidden') return null;

  const opacity = animationState === 'visible' ? 1 : 0;

  return (
    <>
      {/* Full screen backdrop for flashy mode */}
      {flashy && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 14,
            background: 'rgba(0, 0, 0, 0.8)',
            opacity,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onClick={onDismiss}
        />
      )}
      
      <div
        style={{
          position: 'fixed',
          top: flashy ? '50%' : '20px',
          left: '50%',
          transform: flashy ? 'translate(-50%, -50%)' : 'translateX(-50%)',
          zIndex: 15,
          background: flashy 
            ? 'linear-gradient(135deg, rgba(255, 204, 68, 0.95), rgba(255, 154, 0, 0.95))'
            : 'rgba(0, 0, 0, 0.9)',
          color: flashy ? '#000' : '#fff',
          padding: flashy ? '2.5rem 3rem' : '1.5rem 2rem',
          borderRadius: flashy ? '20px' : '12px',
          textAlign: 'center',
          maxWidth: '90vw',
          width: flashy ? '600px' : '500px',
          opacity,
          transition: 'all 0.3s ease-in-out',
          backdropFilter: 'blur(15px)',
          border: flashy 
            ? '3px solid rgba(255, 204, 68, 1)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: flashy 
            ? '0 20px 60px rgba(255, 204, 68, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.3)',
          animation: flashy && animationState === 'visible' ? 'pulse 2s infinite' : 'none',
        }}
        onClick={onDismiss}
      >
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: flashy ? '1.8rem' : '1.2rem',
          fontWeight: '700',
          textShadow: flashy ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'
        }}>
          {title}
        </h2>
        <p style={{ 
          margin: '0 0 1rem 0', 
          lineHeight: 1.5,
          fontSize: flashy ? '1.1rem' : '0.95rem',
          opacity: flashy ? 1 : 0.9,
          fontWeight: flashy ? '500' : 'normal'
        }}>
          {message}
        </p>
        <div style={{
          fontSize: flashy ? '0.9rem' : '0.8rem',
          opacity: flashy ? 0.8 : 0.6,
          fontStyle: 'italic',
          fontWeight: flashy ? '500' : 'normal'
        }}>
          Click to dismiss or continue scrolling
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: ${flashy ? 'translate(-50%, -50%) scale(1)' : 'translateX(-50%) scale(1)'}; 
            box-shadow: ${flashy 
              ? '0 20px 60px rgba(255, 204, 68, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)'
            };
          }
          50% { 
            transform: ${flashy ? 'translate(-50%, -50%) scale(1.02)' : 'translateX(-50%) scale(1.02)'}; 
            box-shadow: ${flashy 
              ? '0 25px 80px rgba(255, 204, 68, 0.6), 0 0 0 2px rgba(255, 255, 255, 0.2)'
              : '0 12px 40px rgba(0, 0, 0, 0.4)'
            };
          }
        }
      `}</style>
    </>
  );
});

export default IntroOverlay;