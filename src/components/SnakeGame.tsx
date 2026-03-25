import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, isGameOver, isPaused, score, onScoreChange, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f2ff';
    ctx.fillStyle = '#00f2ff';
    snake.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      // Head is brighter
      if (index === 0) {
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
      } else {
        ctx.fillStyle = '#00f2ff';
        ctx.shadowColor = '#00f2ff';
      }
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
    });

    // Draw food
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow for other drawings
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative pixel-border bg-black p-1">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black block"
        />
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm border-4 border-dashed border-magenta-500">
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-pixel text-magenta-500 mb-4 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <p className="text-cyan-400 font-mono mb-6 uppercase tracking-widest">DATA_LOSS: {score} UNITS</p>
                <button
                  onClick={resetGame}
                  className="pixel-button"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-pixel text-cyan-500 mb-8 glitch-text" data-text="SUSPENDED">SUSPENDED</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="pixel-button"
                >
                  RESUME_PROCESS
                </button>
                <p className="mt-4 text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]">AWAITING_USER_SIGNAL [SPACE]</p>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-12 text-[10px] font-pixel uppercase tracking-widest mt-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-gray-600">BUFFER_LOAD</span>
          <span className="text-xl text-cyan-400 glitch-text" data-text={score}>{score}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-gray-600">CLOCK_SPEED</span>
          <span className="text-xl text-magenta-400">1.0_Ghz</span>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
