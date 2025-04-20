
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import GameEngine from "@/components/game/GameEngine";
import LoadingScreen from "@/components/game/LoadingScreen";

const PlayGame = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [bestProgress, setBestProgress] = useState(30);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Режимы практики и попыток
  const [practiceMode, setPracticeMode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  useEffect(() => {
    // Имитация загрузки ресурсов
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    // Счетчик попыток
    if (gameStarted && !isLoading) {
      setAttempts(prev => prev + 1);
    }
    
    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isLoading, gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
    setAttempts(prev => prev + 1);
    
    // Воспроизведение музыки уровня
    if (!musicPlaying) {
      audioRef.current = new Audio("/sounds/stereoMadness.mp3");
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.log("Audio playback prevented:", e));
      setMusicPlaying(true);
    }
    
    // Фокус на игровом контейнере для обработки нажатий клавиш
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };
  
  const togglePracticeMode = () => {
    setPracticeMode(!practiceMode);
  };
  
  const toggleMusic = () => {
    if (musicPlaying && audioRef.current) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else if (!musicPlaying) {
      audioRef.current = new Audio("/sounds/stereoMadness.mp3");
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.log("Audio playback prevented:", e));
      setMusicPlaying(true);
    }
  };

  // Обновление прогресса (в реальной игре это будет происходить из GameEngine)
  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          const newProgress = prev + Math.random() * 0.5;
          if (newProgress > bestProgress) {
            setBestProgress(newProgress);
          }
          return newProgress < 100 ? newProgress : 100;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [gameStarted, bestProgress]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black flex flex-col">
      <div className="p-4 flex justify-between items-center bg-black/50">
        <Link to="/">
          <Button variant="outline" className="text-white border-white/30">
            ← Назад
          </Button>
        </Link>
        <div className="flex flex-col items-center">
          <div className="text-white font-bold">Stereo Madness</div>
          <div className="text-xs text-yellow-400">Easy ⭐</div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className={`text-white border-white/30 ${musicPlaying ? 'bg-green-700/50' : ''}`}
            onClick={toggleMusic}
          >
            {musicPlaying ? '🔇' : '🔊'}
          </Button>
          <Button 
            variant="outline" 
            className="text-white border-white/30"
            onClick={() => window.location.reload()}
          >
            ↻
          </Button>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <div className="px-4 py-2 bg-black/30">
        <div className="flex justify-between items-center text-xs text-white mb-1">
          <div className="flex items-center">
            <span className="mr-2">{practiceMode ? '🔧 Практика' : '🏆 Обычный режим'}</span>
            <span>Попытка #{attempts}</span>
          </div>
          <div>
            Прогресс: {Math.round(currentProgress)}% (Лучший: {Math.round(bestProgress)}%)
          </div>
        </div>
        <Progress 
          value={currentProgress} 
          max={100} 
          className="h-2 bg-gray-800" 
          indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500" 
        />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {!gameStarted ? (
          <div className="text-center bg-black/50 p-8 rounded-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">Готов играть?</h2>
            
            <div className="flex flex-col gap-6">
              <Button 
                onClick={handleStartGame}
                className="bg-green-500 hover:bg-green-600 text-white text-xl py-6 px-12 rounded-xl animate-pulse shadow-lg shadow-green-500/30"
              >
                Начать!
              </Button>
              
              <Button 
                onClick={togglePracticeMode}
                variant="outline"
                className={`border-white/30 text-white ${practiceMode ? 'bg-blue-700/50' : ''}`}
              >
                {practiceMode ? '✓ Режим практики' : '□ Режим практики'}
              </Button>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-black/30 p-3 rounded-lg">
                <div className="text-yellow-400 font-bold">12</div>
                <div className="text-xs text-white/70">Монет</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg">
                <div className="text-cyan-400 font-bold">37%</div>
                <div className="text-xs text-white/70">Рекорд</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg">
                <div className="text-pink-400 font-bold">78</div>
                <div className="text-xs text-white/70">Попыток</div>
              </div>
            </div>
          </div>
        ) : (
          <div 
            ref={gameContainerRef}
            tabIndex={0} 
            className="w-full max-w-4xl h-[80vh] border-4 border-cyan-500 rounded-lg bg-black focus:outline-none overflow-hidden shadow-2xl shadow-cyan-500/30"
          >
            <GameEngine />
            
            {/* Полупрозрачное наложение с элементами интерфейса */}
            <div className="absolute top-4 right-4 bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm text-white flex gap-2 items-center">
              <span className="text-yellow-400">💎</span>
              <span>0/3</span>
            </div>
            
            {/* Индикатор попытки */}
            <div className="absolute top-4 left-4 bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm text-white">
              Попытка #{attempts}
            </div>
            
            {/* Подсказка для мобильных устройств */}
            <div className="absolute bottom-20 left-0 w-full flex justify-center pointer-events-none">
              <div className="bg-black/30 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm animate-pulse">
                Нажмите в любом месте для прыжка
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Нижняя панель с дополнительными кнопками */}
      {gameStarted && (
        <div className="p-4 bg-black/50 flex justify-center gap-4">
          <Button 
            variant="outline" 
            className="text-white border-white/30"
            onClick={() => setGameStarted(false)}
          >
            Пауза
          </Button>
          <Button 
            variant={practiceMode ? "default" : "outline"}
            className={practiceMode ? "bg-blue-600" : "text-white border-white/30"}
            onClick={togglePracticeMode}
          >
            {practiceMode ? "Выключить практику" : "Включить практику"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlayGame;
