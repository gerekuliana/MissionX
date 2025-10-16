import React, { useRef, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 1, y: 0 }; // moving right initially

    const gameLoop = () => {
      // Move snake
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      // Wall collision (wrap around)
      if (head.x < 0) head.x = canvas.width / gridSize - 1;
      if (head.x >= canvas.width / gridSize) head.x = 0;
      if (head.y < 0) head.y = canvas.height / gridSize - 1;
      if (head.y >= canvas.height / gridSize) head.y = 0;

      snake.unshift(head);
      snake.pop(); // In a real game, this would only happen if not eating food

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      context.fillStyle = 'green';
      snake.forEach(segment => {
        context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
      });
    };

    const intervalId = setInterval(gameLoop, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) direction = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y === 0) direction = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x === 0) direction = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x === 0) direction = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Snake Game
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Use arrow keys to control the snake.
      </Typography>
      <Box sx={{ border: '1px solid grey' }}>
        <canvas ref={canvasRef} width="400" height="400" />
      </Box>
    </Paper>
  );
};

export default GamePage;
