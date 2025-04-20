
import { useEffect, useRef, useState } from "react";

// Размеры игрока и препятствий
const PLAYER_SIZE = 30;
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const GAME_SPEED = 5;

const GameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [deaths, setDeaths] = useState(0);
  
  // Состояние игрока
  const playerRef = useRef({
    x: 100,
    y: 0,
    velocity: 0,
    isJumping: false,
    rotation: 0
  });
  
  // Состояние препятствий
  const obstaclesRef = useRef<Array<{x: number, y: number, width: number, height: number}>>([
    { x: 600, y: 0, width: 30, height: 60 },
    { x: 900, y: 0, width: 30, height: 40 },
    { x: 1200, y: 0, width: 30, height: 70 },
    { x: 1500, y: 0, width: 100, height: 30 },
    { x: 1800, y: 0, width: 30, height: 50 },
  ]);
  
  // Обработка ввода
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "ArrowUp") && !playerRef.current.isJumping && isPlaying) {
        playerRef.current.velocity = JUMP_FORCE;
        playerRef.current.isJumping = true;
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);
  
  // Игровой цикл
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationFrameId: number;
    let groundLevel = canvas.height - PLAYER_SIZE - 40;
    
    const player = playerRef.current;
    const obstacles = obstaclesRef.current;
    
    player.y = groundLevel;
    
    // Игровой цикл
    const render = () => {
      if (!isPlaying) return;
      
      // Очищаем холст
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем землю
      ctx.fillStyle = "#3a86ff";
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      
      // Обновляем положение игрока
      player.velocity += GRAVITY;
      player.y += player.velocity;
      player.rotation += 4;
      
      // Проверяем коллизию с землей
      if (player.y > groundLevel) {
        player.y = groundLevel;
        player.velocity = 0;
        player.isJumping = false;
      }
      
      // Рисуем игрока (куб с вращением)
      ctx.save();
      ctx.translate(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
      ctx.rotate((player.rotation * Math.PI) / 180);
      ctx.fillStyle = "#ff006e";
      ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
      
      // Рисуем грань куба
      ctx.fillStyle = "#ffffff33";
      ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, 5);
      ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, 5, PLAYER_SIZE);
      ctx.restore();
      
      // Обновляем и рисуем препятствия
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= GAME_SPEED;
        
        // Рисуем препятствие
        ctx.fillStyle = "#00b4d8";
        ctx.fillRect(
          obstacles[i].x, 
          canvas.height - obstacles[i].height - 40, 
          obstacles[i].width, 
          obstacles[i].height
        );
        
        // Проверяем коллизию
        if (
          player.x < obstacles[i].x + obstacles[i].width &&
          player.x + PLAYER_SIZE > obstacles[i].x &&
          player.y < canvas.height - obstacles[i].height - 40 + obstacles[i].height &&
          player.y + PLAYER_SIZE > canvas.height - obstacles[i].height - 40
        ) {
          // Столкновение
          setIsPlaying(false);
          setDeaths(prev => prev + 1);
          
          // Перезапуск после паузы
          setTimeout(() => {
            player.y = groundLevel;
            player.velocity = 0;
            player.rotation = 0;
            
            for (let j = 0; j < obstacles.length; j++) {
              obstacles[j].x += 1000; // Переносим препятствия вперед
            }
            
            setIsPlaying(true);
          }, 1000);
          
          return;
        }
        
        // Если препятствие ушло за экран, возвращаем его
        if (obstacles[i].x + obstacles[i].width < 0) {
          obstacles[i].x = canvas.width + Math.random() * 300;
          obstacles[i].height = 30 + Math.random() * 70;
        }
      }
      
      // Рисуем прогресс
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px Arial";
      ctx.fillText(`Смерти: ${deaths}`, 20, 30);
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [deaths, isPlaying]);
  
  return (
    <canvas 
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-900"
    />
  );
};

export default GameEngine;
