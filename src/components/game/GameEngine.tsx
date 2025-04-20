
import React, { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface GameEngineProps {
  onGameOver?: () => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  // Референсы для игровой логики
  const playerRef = useRef({
    x: 100,
    y: 250,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -10,
    isJumping: false,
    rotation: 0
  });
  
  const gameStateRef = useRef({
    obstacles: [] as { x: number, y: number, width: number, height: number, type: string }[],
    speed: 5,
    groundLevel: 300,
    isGameOver: false,
    animationFrame: 0,
    lastObstacleTime: 0,
    score: 0,
    distance: 0,
    totalDistance: 2000, // Общая длина уровня
  });

  // Функция для обработки прыжка
  const handleJump = () => {
    const player = playerRef.current;
    if (!gameStateRef.current.isGameOver) {
      if (!gameStarted) {
        setGameStarted(true);
      }
      
      if (!player.isJumping) {
        player.velocity = player.jumpStrength;
        player.isJumping = true;
      }
    }
  };
  
  // Добавляем обработчики событий
  useEffect(() => {
    // Обработчик клавиатуры (пробел и стрелка вверх)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        handleJump();
      }
    };
    
    // Обработчик касания для мобильных устройств
    const handleTouch = () => {
      handleJump();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouch);
    
    // Обработчик клика мышью для прыжка
    document.addEventListener('click', handleJump);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('click', handleJump);
    };
  }, []);

  // Основной игровой цикл
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Создаем препятствия с разными интервалами
    const createObstacle = () => {
      const now = Date.now();
      const gameState = gameStateRef.current;
      
      if (now - gameState.lastObstacleTime > 1200) {
        // Случайный тип препятствия
        const types = ['spike', 'block', 'doubleSpike'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let width = 30;
        let height = 30;
        
        // Настраиваем размеры в зависимости от типа
        if (type === 'spike') {
          width = 30;
          height = 30;
        } else if (type === 'block') {
          width = 40;
          height = 40;
        } else if (type === 'doubleSpike') {
          width = 60;
          height = 30;
        }
        
        const obstacle = {
          x: canvas.width,
          y: gameState.groundLevel - height,
          width,
          height,
          type
        };
        
        gameState.obstacles.push(obstacle);
        gameState.lastObstacleTime = now;
      }
    };
    
    // Функция для отрисовки игры
    const render = () => {
      const player = playerRef.current;
      const gameState = gameStateRef.current;
      
      // Очищаем канвас
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем фон (градиент)
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0f2a50');
      bgGradient.addColorStop(1, '#0a1628');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем фоновые элементы (звезды, горы и т.д.)
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        const x = (i * 20 + gameState.animationFrame / 10) % canvas.width;
        const y = 50 + Math.sin(i * 0.1 + gameState.animationFrame * 0.01) * 30;
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Рисуем землю
      ctx.fillStyle = '#203b60';
      ctx.fillRect(0, gameState.groundLevel, canvas.width, canvas.height - gameState.groundLevel);
      
      // Сетка на земле
      ctx.strokeStyle = '#1a2b42';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 20) {
        const x = (i - gameState.animationFrame % 20);
        ctx.moveTo(x, gameState.groundLevel);
        ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();
      
      // Рисуем игрока (куб) - ИСПРАВЛЕНО ОТОБРАЖЕНИЕ КУБА
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
      ctx.rotate(player.rotation);
      
      // Тело куба
      const cubeGradient = ctx.createLinearGradient(-player.width/2, -player.height/2, player.width/2, player.height/2);
      cubeGradient.addColorStop(0, '#ff55a0');
      cubeGradient.addColorStop(1, '#ff0066');
      ctx.fillStyle = cubeGradient;
      ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
      
      // Детали куба - добавляем ярче обводку и эффекты
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.strokeRect(-player.width / 2, -player.height / 2, player.width, player.height);
      
      // Внутренние линии куба - более заметные
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.moveTo(-player.width / 2, -player.height / 2);
      ctx.lineTo(player.width / 2, player.height / 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(player.width / 2, -player.height / 2);
      ctx.lineTo(-player.width / 2, player.height / 2);
      ctx.stroke();
      
      // Добавляем эффект свечения для лучшей видимости
      ctx.shadowColor = '#ff0066';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(-player.width / 2, -player.height / 2, player.width, player.height);
      ctx.shadowBlur = 0;
      
      ctx.restore();
      
      // Отрисовка препятствий
      gameState.obstacles.forEach((obstacle) => {
        if (obstacle.type === 'spike') {
          // Рисуем шип (треугольник)
          ctx.fillStyle = '#00aaff';
          ctx.beginPath();
          ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y);
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          ctx.closePath();
          ctx.fill();
          
          // Контур шипа
          ctx.strokeStyle = '#66ccff';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (obstacle.type === 'block') {
          // Рисуем блок
          const blockGradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          blockGradient.addColorStop(0, '#00aaff');
          blockGradient.addColorStop(1, '#0066cc');
          ctx.fillStyle = blockGradient;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          
          // Детали блока
          ctx.strokeStyle = '#66ccff';
          ctx.lineWidth = 2;
          ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'doubleSpike') {
          // Рисуем двойной шип
          ctx.fillStyle = '#00aaff';
          
          // Первый шип
          ctx.beginPath();
          ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x + obstacle.width / 4, obstacle.y);
          ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height);
          ctx.closePath();
          ctx.fill();
          
          // Второй шип
          ctx.beginPath();
          ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x + obstacle.width * 3/4, obstacle.y);
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          ctx.closePath();
          ctx.fill();
          
          // Контуры шипов
          ctx.strokeStyle = '#66ccff';
          ctx.lineWidth = 2;
          
          ctx.beginPath();
          ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x + obstacle.width / 4, obstacle.y);
          ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height);
          ctx.closePath();
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x + obstacle.width * 3/4, obstacle.y);
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          ctx.closePath();
          ctx.stroke();
        }
      });
      
      // Отображаем счет
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Arial';
      ctx.fillText(`Счет: ${gameState.score}`, 20, 30);
      
      // Отображаем прогресс уровня
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(`Прогресс: ${Math.floor((gameState.distance / gameState.totalDistance) * 100)}%`, canvas.width - 150, 30);
      
      // Отладочная информация для видимости куба
      ctx.fillStyle = '#ff0000';
      ctx.font = '12px Arial';
      ctx.fillText(`Куб: x=${Math.floor(player.x)}, y=${Math.floor(player.y)}`, 20, 50);
    };
    
    // Функция обновления игры
    const update = () => {
      if (gameStateRef.current.isGameOver || !gameStarted) return;
      
      const player = playerRef.current;
      const gameState = gameStateRef.current;
      
      // Обновляем счетчик анимации
      gameState.animationFrame++;
      
      // Добавляем препятствия
      createObstacle();
      
      // Обновляем положение игрока
      player.velocity += player.gravity;
      player.y += player.velocity;
      
      // Ограничиваем игрока уровнем земли
      if (player.y + player.height > gameState.groundLevel) {
        player.y = gameState.groundLevel - player.height;
        player.velocity = 0;
        player.isJumping = false;
      }
      
      // Вращаем куб при прыжке
      if (player.isJumping) {
        player.rotation += 0.1;
      } else {
        player.rotation = 0;
      }
      
      // Обновляем препятствия
      gameState.obstacles = gameState.obstacles.filter(obstacle => {
        // Двигаем препятствие
        obstacle.x -= gameState.speed;
        
        // Проверяем столкновение
        if (
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y
        ) {
          gameState.isGameOver = true;
          if (onGameOver) onGameOver();
        }
        
        // Увеличиваем счет, если игрок прошел препятствие
        if (obstacle.x + obstacle.width < player.x && obstacle.x + obstacle.width > player.x - gameState.speed) {
          gameState.score += 10;
          setScore(gameState.score);
        }
        
        // Удаляем препятствия, которые вышли за пределы экрана
        return obstacle.x + obstacle.width > 0;
      });
      
      // Увеличиваем пройденное расстояние
      gameState.distance += gameState.speed;
      
      // Обновляем прогресс
      const currentProgress = Math.min(100, (gameState.distance / gameState.totalDistance) * 100);
      setProgress(currentProgress);
      
      // Проверяем, завершен ли уровень
      if (gameState.distance >= gameState.totalDistance) {
        // Уровень пройден!
        gameState.isGameOver = true;
        if (onGameOver) onGameOver();
      }
    };
    
    // Главный игровой цикл
    const gameLoop = () => {
      update();
      render();
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Запускаем игровой цикл
    gameLoop();
    
    // Очистка ресурсов при размонтировании компонента
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, gameStarted, onGameOver]);
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
          <div className="text-white text-center p-6 bg-blue-900/80 rounded-lg max-w-sm">
            <h2 className="text-3xl font-bold mb-4">Geometry Dash</h2>
            <p className="mb-4">Нажмите на экран или пробел для начала игры</p>
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-pink-500 animate-bounce rounded" />
            </div>
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-blue-500 shadow-lg shadow-blue-500/20 rounded"
        onClick={handleJump} // Добавлен обработчик клика прямо на canvas
      />
      
      {/* Индикатор прогресса */}
      <div className="w-full max-w-md mt-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>{Math.floor(progress)}%</span>
          <span>{score} очков</span>
        </div>
      </div>
    </div>
  );
};

export default GameEngine;
