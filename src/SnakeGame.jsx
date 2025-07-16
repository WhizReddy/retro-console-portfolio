import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500; // Make it taller
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

function generateFood(snake) {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
}

export default function SnakeGame({ onComplete, onClose }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(() => generateFood(INITIAL_SNAKE));
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const canvasRef = useRef();
  const gameLoopRef = useRef();

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameWon) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return INITIAL_SNAKE; // Reset snake
      }

      // Self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return INITIAL_SNAKE; // Reset snake
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood(newSnake));
        setGameWon(true);
        setTimeout(() => onComplete(), 1000); // Complete after 1 second
        return newSnake; // Don't remove tail (snake grows)
      }

      newSnake.pop(); // Remove tail
      return newSnake;
    });
  }, [direction, food, gameStarted, gameWon, onComplete]);

  useEffect(() => {
    if (gameStarted && !gameWon) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [moveSnake, gameStarted, gameWon]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = CANVAS_WIDTH / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, CANVAS_HEIGHT);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(CANVAS_WIDTH, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach((segment, index) => {
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      
      // Snake head highlight
      if (index === 0) {
        ctx.fillStyle = '#0a0';
        ctx.fillRect(
          segment.x * cellSize + 3,
          segment.y * cellSize + 3,
          cellSize - 6,
          cellSize - 6
        );
        ctx.fillStyle = '#0f0';
      }
    });

    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
  }, [snake, food]);

  const startGame = () => {
    setGameStarted(true);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameWon(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0f0',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          background: '#111',
          padding: '2rem',
          borderRadius: '10px',
          border: '2px solid #0f0',
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
        }}
      >
        <h2 style={{ 
          margin: '0 0 1.5rem 0', 
          color: '#0f0',
          textShadow: '0 0 20px #0f0, 0 0 40px #0f0',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          letterSpacing: '3px',
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          🐍 RETRO SNAKE
        </h2>
        
        {!gameStarted ? (
          <div>
            <div style={{ 
              margin: '0 0 2rem 0', 
              padding: '1rem',
              border: '1px solid #0f0',
              borderRadius: '8px',
              background: 'rgba(0, 255, 0, 0.05)'
            }}>
              <p style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#0f0', 
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                🎯 MISSION
              </p>
              <p style={{ 
                margin: '0', 
                color: '#ccc',
                fontSize: '0.95rem'
              }}>
                Catch one apple to unlock the next level!
              </p>
            </div>
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(45deg, #0f0, #0a0)',
                color: '#000',
                border: '2px solid #0f0',
                padding: '1rem 3rem',
                fontSize: '1.4rem',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #0a0, #080)';
                e.target.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #0f0, #0a0)';
                e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ▶ START GAME
            </button>
          </div>
        ) : (
          <div>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              style={{
                border: '2px solid #0f0',
                borderRadius: '5px',
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
              }}
            />
            
            {gameWon ? (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#0f0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  🎉 SUCCESS! Continuing...
                </p>
              </div>
            ) : (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  Use arrow keys to move • Catch the red apple!
                </p>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'transparent',
            color: '#666',
            border: '1px solid #666',
            padding: '0.5rem',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.8rem',
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