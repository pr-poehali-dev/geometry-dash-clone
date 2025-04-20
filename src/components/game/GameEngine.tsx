
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
  const obstaclesRef = useRef<Array<{x: number, y: number, width: number, height: number, type: string}>>([
    { x: 600, y: 0, width: 30, height: 60, type: 'spike' },
    { x: 900, y: 0, width: 30, height: 40, type: 'block' },
    { x: 1200, y: 0, width: 30, height: 70, type: 'spike' },
    { x: 1500, y: 0, width: 100, height: 30, type: 'block' },
    { x: 1800, y: 0, width: 30, height: 50, type: 'spike' },
  ]);
  
  // Фоновые элементы для параллакса
  const backgroundElementsRef = useRef<Array<{x: number, y: number, size: number, speed: number, color: string}>>([]);
  
  // Инициализация фоновых элементов
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Создаем фоновые элементы для параллакса
    for (let i = 0; i < 20; i++) {
      backgroundElementsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 3 + Math.random() * 8,
        speed: 0.5 + Math.random() * 1.5,
        color: `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, 255, ${0.2 + Math.random() * 0.5})`
      });
    }
  }, []);
  
  // Обработка ввода с клавиатуры
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
  
  // Обработка нажатия на экран
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleTouchStart = () => {
      if (!playerRef.current.isJumping && isPlaying) {
        playerRef.current.velocity = JUMP_FORCE;
        playerRef.current.isJumping = true;
      }
    };
    
    const handleMouseDown = () => {
      if (!playerRef.current.isJumping && isPlaying) {
        playerRef.current.velocity = JUMP_FORCE;
        playerRef.current.isJumping = true;
      }
    };
    
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("mousedown", handleMouseDown);
    
    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
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
    const backgroundElements = backgroundElementsRef.current;
    
    player.y = groundLevel;
    
    // Функция для рисования шипа
    const drawSpike = (x: number, y: number, width: number, height: number) => {
      ctx.fillStyle = "#00b4d8";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width / 2, y - height);
      ctx.closePath();
      ctx.fill();
      
      // Внутренний блик
      ctx.fillStyle = "#7fdbff";
      ctx.beginPath();
      ctx.moveTo(x + width * 0.2, y - height * 0.2);
      ctx.lineTo(x + width * 0.5, y - height * 0.7);
      ctx.lineTo(x + width * 0.3, y - height * 0.4);
      ctx.closePath();
      ctx.fill();
    };
    
    // Функция для рисования блока
    const drawBlock = (x: number, y: number, width: number, height: number) => {
      // Основа блока
      const gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, "#00b4d8");
      gradient.addColorStop(1, "#0096c7");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, height);
      
      // Добавляем детали блока
      ctx.fillStyle = "#7fdbff";
      ctx.fillRect(x + 3, y + 3, width - 6, height / 3);
      
      // Контур блока
      ctx.strokeStyle = "#023e8a";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    };
    
    // Функция для рисования сетки фона
    const drawGrid = () => {
      ctx.strokeStyle = "#ffffff10";
      ctx.lineWidth = 1;
      
      // Горизонтальные линии
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Вертикальные линии
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    };
    
    // Игровой цикл
    const render = () => {
      if (!isPlaying) return;
      
      // Очищаем холст
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем градиентный фон
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "#051937");
      bgGradient.addColorStop(1, "#160e37");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем сетку
      drawGrid();
      
      // Рисуем фоновые элементы (параллакс)
      for (let i = 0; i < backgroundElements.length; i++) {
        const el = backgroundElements[i];
        el.x -= el.speed;
        
        if (el.x + el.size < 0) {
          el.x = canvas.width + el.size;
          el.y = Math.random() * canvas.height;
        }
        
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.size, el.size);
      }
      
      // Рисуем землю
      const groundGradient = ctx.createLinearGradient(0, canvas.height - 40, 0, canvas.height);
      groundGradient.addColorStop(0, "#3a86ff");
      groundGradient.addColorStop(1, "#0d3b66");
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      
      // Детали земли
      for (let x = 0; x < canvas.width; x += 80) {
        ctx.fillStyle = "#60a5fa50";
        ctx.fillRect(x, canvas.height - 40, 40, 8);
      }
      
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
      
      // Тень куба
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(-PLAYER_SIZE / 2 + 2, -PLAYER_SIZE / 2 + 2, PLAYER_SIZE, PLAYER_SIZE);
      
      // Основа куба
      const cubeFill = ctx.createLinearGradient(
        -PLAYER_SIZE / 2, -PLAYER_SIZE / 2, 
        PLAYER_SIZE / 2, PLAYER_SIZE / 2
      );
      cubeFill.addColorStop(0, "#ff006e");
      cubeFill.addColorStop(1, "#b80050");
      ctx.fillStyle = cubeFill;
      ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
      
      // Детали куба
      ctx.fillStyle = "#ff6b9e";
      ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, 5);
      ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, 5, PLAYER_SIZE);
      
      // Узор на кубе
      ctx.fillStyle = "#ffffff40";
      ctx.fillRect(-PLAYER_SIZE / 4, -PLAYER_SIZE / 4, PLAYER_SIZE / 2, PLAYER_SIZE / 2);
      
      // Контур куба
      ctx.strokeStyle = "#720033";
      ctx.lineWidth = 2;
      ctx.strokeRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
      
      ctx.restore();
      
      // Обновляем и рисуем препятствия
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= GAME_SPEED;
        
        // Рисуем препятствие в зависимости от типа
        if (obstacles[i].type === 'spike') {
          drawSpike(
            obstacles[i].x, 
            canvas.height - obstacles[i].height - 40, 
            obstacles[i].width, 
            obstacles[i].height
          );
        } else {
          drawBlock(
            obstacles[i].x, 
            canvas.height - obstacles[i].height - 40, 
            obstacles[i].width, 
            obstacles[i].height
          );
        }
        
        // Проверяем коллизию
        if (
          player.x < obstacles[i].x + obstacles[i].width &&
          player.x + PLAYER_SIZE > obstacles[i].x &&
          player.y < canvas.height - obstacles[i].height - 40 + obstacles[i].height &&
          player.y + PLAYER_SIZE > canvas.height - obstacles[i].height - 40
        ) {
          // Эффект столкновения
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = 0.7;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
          
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
          // Случайно выбираем тип препятствия
          obstacles[i].type = Math.random() > 0.5 ? 'spike' : 'block';
        }
      }
      
      // Рисуем прогресс-бар
      const progressBarWidth = 200;
      const progressBarHeight = 10;
      ctx.fillStyle = "#333333";
      ctx.fillRect(canvas.width / 2 - progressBarWidth / 2, 15, progressBarWidth, progressBarHeight);
      ctx.fillStyle = "#00e1ff";
      ctx.fillRect(canvas.width / 2 - progressBarWidth / 2, 15, progressBarWidth * 0.3, progressBarHeight);
      
      // Рисуем счетчик смертей
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Смерти: ${deaths}`, 20, 30);
      
      // Рисуем процент прохождения
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`30%`, canvas.width / 2 + progressBarWidth / 2 + 25, 25);
      
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
      className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-900 touch-none cursor-pointer"
    />
  );
};

export default GameEngine;
