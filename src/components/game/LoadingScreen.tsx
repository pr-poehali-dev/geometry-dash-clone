
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [showTip, setShowTip] = useState(0);
  
  const tips = [
    "Нажми на экран или пробел для прыжка!",
    "Собирай монеты, чтобы разблокировать новые кубы и цвета",
    "Пройди 100% уровня, чтобы получить все 3 звезды",
    "Практика делает мастера! Не сдавайся!",
    "Время прыжка влияет на высоту и дальность"
  ];
  
  useEffect(() => {
    // Меняем подсказки каждые 3 секунды
    const tipInterval = setInterval(() => {
      setShowTip(prev => (prev + 1) % tips.length);
    }, 3000);
    
    // Симулируем загрузку
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Случайное увеличение для более реалистичной загрузки
        return Math.min(100, prev + Math.random() * 8 + 2);
      });
    }, 100);
    
    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [tips.length]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Анимированный фон с частицами */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, index) => (
          <div 
            key={index}
            className="absolute bg-blue-300/20 rounded-full animate-pulse"
            style={{ 
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Сетка фона */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
        {Array.from({ length: 144 }).map((_, idx) => (
          <div key={idx} className="border border-cyan-300/20" />
        ))}
      </div>
      
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 animate-pulse">Geometry Dash</h1>
        <div className="text-white text-xl mb-4">Загрузка уровня...</div>
        
        {/* Название уровня */}
        <div className="text-4xl font-bold text-yellow-400 mb-6 animate-bounce">
          Stereo Madness
        </div>
      </div>
      
      <div className="w-64 mb-8 relative z-10">
        <Progress value={progress} className="h-3 bg-blue-950" indicatorClassName="bg-gradient-to-r from-cyan-400 to-blue-500" />
        <div className="text-white text-right mt-2 flex justify-between items-center">
          <div className="text-xs text-cyan-300">ЗАГРУЗКА...</div>
          <div>{Math.round(progress)}%</div>
        </div>
      </div>
      
      {/* Вращающийся куб */}
      <div className="relative mb-10 animate-bounce" style={{ animationDuration: '2s' }}>
        <div 
          className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-700 rotate-45 transform transition-transform duration-300"
          style={{ animation: 'spin 2s linear infinite' }}
        >
          {/* Детали куба */}
          <div className="absolute inset-0 border-2 border-pink-300/50"></div>
          <div className="absolute left-0 top-0 w-full h-2 bg-pink-300/30"></div>
          <div className="absolute left-0 top-0 w-2 h-full bg-pink-300/30"></div>
        </div>
      </div>
      
      <div className="flex gap-4 relative z-10">
        {[...Array(3)].map((_, index) => (
          <div 
            key={index}
            className="w-6 h-6 bg-cyan-500 animate-bounce"
            style={{ 
              animationDelay: `${index * 0.15}s`,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
            }}
          />
        ))}
      </div>
      
      {/* Подсказки */}
      <div className="absolute bottom-10 left-0 w-full text-center">
        <div className="text-white/80 text-sm px-4 py-2 bg-blue-900/50 mx-auto max-w-md rounded-lg transition-opacity duration-500">
          <span className="text-cyan-400 font-bold mr-2">TIP:</span>
          {tips[showTip]}
        </div>
      </div>
      
      <div className="absolute bottom-4 text-white/60 text-sm animate-pulse">
        Нажмите на экран или пробел для прыжка
      </div>
    </div>
  );
};

export default LoadingScreen;
