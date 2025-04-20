
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GDLogo from "@/components/game/GDLogo";
import { useState, useEffect } from "react";

const Index = () => {
  const [menuState, setMenuState] = useState<'main' | 'levels' | 'create'>('main');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  
  // Иконки персонажей
  const icons = [
    { name: "Default Cube", unlocked: true },
    { name: "Spiky", unlocked: true },
    { name: "Happy", unlocked: false },
    { name: "Cool", unlocked: false },
    { name: "Angry", unlocked: false },
    { name: "Robot", unlocked: false },
  ];
  
  // Цвета персонажей
  const colors = [
    { name: "Pink", color: "#ff006e", unlocked: true },
    { name: "Blue", color: "#3a86ff", unlocked: true },
    { name: "Green", color: "#38b000", unlocked: true },
    { name: "Orange", color: "#fb5607", unlocked: false },
    { name: "Purple", color: "#8338ec", unlocked: false },
    { name: "Yellow", color: "#ffbe0b", unlocked: false },
  ];
  
  // Анимация фоновых элементов
  const [backgroundElements, setBackgroundElements] = useState<
    Array<{ x: number; y: number; size: number; speed: number; color: string }>
  >([]);
  
  useEffect(() => {
    // Создаем фоновые элементы для параллакса
    const elements = [];
    for (let i = 0; i < 30; i++) {
      elements.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 3 + Math.random() * 8,
        speed: 0.5 + Math.random() * 1.5,
        color: `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, 255, ${0.2 + Math.random() * 0.5})`
      });
    }
    setBackgroundElements(elements);
    
    // Анимация фоновых элементов
    const animateBackground = () => {
      setBackgroundElements(prev => 
        prev.map(el => ({
          ...el,
          x: el.x - el.speed < -el.size ? window.innerWidth : el.x - el.speed
        }))
      );
      requestAnimationFrame(animateBackground);
    };
    
    const animationId = requestAnimationFrame(animateBackground);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  const toggleMusic = () => {
    if (audioPlaying) {
      // Stop music
      setAudioPlaying(false);
    } else {
      // Play lobby music
      const audio = new Audio("/sounds/menuLoop.mp3");
      audio.loop = true;
      audio.play().catch(e => console.log("Audio playback prevented:", e));
      setAudioPlaying(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundElements.map((el, index) => (
          <div 
            key={index}
            className="absolute" 
            style={{
              left: el.x + 'px',
              top: el.y + 'px',
              width: el.size + 'px',
              height: el.size + 'px',
              backgroundColor: el.color,
              boxShadow: `0 0 ${el.size/2}px ${el.color}`,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
      
      {/* Сетка фона */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
        {Array.from({ length: 144 }).map((_, idx) => (
          <div key={idx} className="border border-white/30" />
        ))}
      </div>
      
      {/* Контент главного меню */}
      <div className="relative w-full max-w-3xl text-center z-10">
        <GDLogo className="mx-auto mb-8 animate-pulse" />
        
        {menuState === 'main' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Link to="/play">
                <Button 
                  variant="default" 
                  className="w-full py-6 text-xl bg-green-500 hover:bg-green-600 transition-all hover:scale-105 shadow-lg shadow-green-500/50"
                >
                  Играть
                </Button>
              </Link>
              <Button 
                variant="default" 
                className="w-full py-6 text-xl bg-purple-500 hover:bg-purple-600 transition-all hover:scale-105 shadow-lg shadow-purple-500/50"
                onClick={() => setMenuState('create')}
              >
                Создать
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="w-full py-4 bg-blue-500/80 hover:bg-blue-600 border-white/20 text-white transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
                onClick={() => setMenuState('levels')}
              >
                Уровни
              </Button>
              <Button 
                variant="outline" 
                className="w-full py-4 bg-blue-500/80 hover:bg-blue-600 border-white/20 text-white transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                Настройки
              </Button>
              <Button 
                variant="outline" 
                className="w-full py-4 bg-blue-500/80 hover:bg-blue-600 border-white/20 text-white transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                Профиль
              </Button>
            </div>
            
            {/* Значки на главном экране */}
            <div className="mt-12 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">5</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">2</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">❤️</span>
                </div>
                <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">🏆</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {menuState === 'levels' && (
          <div className="bg-black/40 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Выбрать уровень</h2>
              <Button 
                variant="outline" 
                className="border-white/20 text-white"
                onClick={() => setMenuState('main')}
              >
                ← Назад
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="text-lg font-bold text-white">Stereo Madness</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">⭐ Easy</div>
                  <div className="text-white/80 text-sm">0/3 ⭐</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="text-lg font-bold text-white">Back on Track</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">⭐ Easy</div>
                  <div className="text-white/80 text-sm">0/3 ⭐</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="text-lg font-bold text-white">Polargeist</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="bg-orange-400 text-black px-2 py-1 rounded-full text-xs font-bold">⭐⭐ Normal</div>
                  <div className="text-white/80 text-sm">0/3 ⭐</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <div className="text-lg font-bold text-white">Dry Out</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="bg-orange-400 text-black px-2 py-1 rounded-full text-xs font-bold">⭐⭐ Normal</div>
                  <div className="text-white/80 text-sm">0/3 ⭐</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform opacity-60">
                <div className="text-lg font-bold text-white">Base After Base</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="bg-red-400 text-black px-2 py-1 rounded-full text-xs font-bold">⭐⭐⭐ Hard</div>
                  <div className="text-white/80 text-sm">🔒 Locked</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform opacity-60">
                <div className="text-lg font-bold text-white">Cant Let Go</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="bg-red-400 text-black px-2 py-1 rounded-full text-xs font-bold">⭐⭐⭐ Hard</div>
                  <div className="text-white/80 text-sm">🔒 Locked</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {menuState === 'create' && (
          <div className="bg-black/40 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Персонализация</h2>
              <Button 
                variant="outline" 
                className="border-white/20 text-white"
                onClick={() => setMenuState('main')}
              >
                ← Назад
              </Button>
            </div>
            
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-white text-xl mb-3">Выбрать иконку</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {icons.map((icon, idx) => (
                    <div 
                      key={idx}
                      className={`aspect-square p-2 rounded-lg cursor-pointer transition-all ${
                        selectedIcon === idx 
                          ? 'bg-white/30 scale-110 shadow-lg' 
                          : 'bg-black/30 hover:bg-white/10'
                      } ${!icon.unlocked && 'opacity-50'}`}
                      onClick={() => icon.unlocked && setSelectedIcon(idx)}
                    >
                      <div 
                        className="w-full h-full bg-gradient-to-br from-[#ff006e] to-[#b80050] rounded-md flex items-center justify-center"
                        style={{ backgroundColor: colors[selectedColor].color }}
                      >
                        <div className="text-lg font-bold">
                          {idx === 0 && '◼'}
                          {idx === 1 && '◆'}
                          {idx === 2 && '☺'}
                          {idx === 3 && '😎'}
                          {idx === 4 && '😠'}
                          {idx === 5 && '🤖'}
                        </div>
                        {!icon.unlocked && <div className="absolute">🔒</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-white text-xl mb-3">Выбрать цвет</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {colors.map((color, idx) => (
                    <div 
                      key={idx}
                      className={`aspect-square p-2 rounded-lg cursor-pointer transition-all ${
                        selectedColor === idx 
                          ? 'bg-white/30 scale-110 shadow-lg' 
                          : 'bg-black/30 hover:bg-white/10'
                      } ${!color.unlocked && 'opacity-50'}`}
                      onClick={() => color.unlocked && setSelectedColor(idx)}
                    >
                      <div 
                        className="w-full h-full rounded-md"
                        style={{ backgroundColor: color.color }}
                      >
                        {!color.unlocked && <div className="w-full h-full flex items-center justify-center">🔒</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="default" 
                  className="w-full py-4 bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/50"
                >
                  Открыть редактор уровней
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 w-full h-24 bg-black/40 flex items-center justify-center">
        <div className={`animate-bounce bg-yellow-400 p-2 rounded-full ${audioPlaying ? 'bg-green-400' : 'bg-yellow-400'}`}>
          <Button 
            variant="ghost" 
            className="text-black font-bold"
            onClick={toggleMusic}
          >
            {audioPlaying ? '🔊 Выключить музыку' : '🔊 Включить музыку'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
