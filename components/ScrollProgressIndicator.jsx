import React from 'react';

const ScrollProgressIndicator = React.memo(function ScrollProgressIndicator({ 
  currentStage = 0, 
  totalStages = 4,
  stageNames = ['Start', 'Intro', 'Guide', 'Play']
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '8px',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {Array.from({ length: totalStages }, (_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: index <= currentStage 
                ? 'rgba(255, 204, 68, 1)' 
                : 'rgba(255, 255, 255, 0.3)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
      
      {/* Current stage label */}
      <div
        style={{
          color: '#fff',
          fontSize: '0.7rem',
          opacity: 0.8,
          textAlign: 'center',
          minWidth: '60px',
        }}
      >
        {stageNames[currentStage] || `Stage ${currentStage}`}
      </div>
    </div>
  );
});

export default ScrollProgressIndicator;