
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GDLogo from "@/components/game/GDLogo";
import { useState, useEffect } from "react";

const Index = () => {
  const [menuState, setMenuState] = useState<'main' | 'levels' | 'create' | 'icons' | 'settings'>('main');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('official');
  
  // Иконки персонажей
  const icons = [
    { name: "Default Cube", unlocked: true },
    { name: "Spiky", unlocked: true },
    { name: "Happy", unlocked: true },
    { name: "Cool", unlocked: false },
    { name: "Angry", unlocked: false },
    { name: "Robot", unlocked: false },
    { name: "Ghost", unlocked: false },
    { name: "UFO", unlocked: false },
  ];
  
  // Цвета персонажей
  const colors = [
    { name: "Pink", color: "#ff006e", unlocked: true },
    { name: "Blue", color: "#3a86ff", unlocked: true },
    { name: "Green", color: "#38b000", unlocked: true },
    { name: "Orange", color: "#fb5607", unlocked: true },
    { name: "Purple", color: "#8338ec", unlocked: false },
    { name: "Yellow", color: "#ffbe0b", unlocked: false },
    { name: "Cyan", color: "#00b4d8", unlocked: false },
    { name: "Red", color: "#e63946", unlocked: false },
  ];
  
  // Список официальных уровней
  const officialLevels = [
    { name: "Stereo Madness", difficulty: "Easy", stars: 1, color: "from-green-600 to-green-400", completed: true, unlocked: true },
    { name: "Back on Track", difficulty: "Easy", stars: 1, color: "from-green-600 to-green-400", completed: true, unlocked: true },
    { name: "Polargeist", difficulty: "Normal", stars: 2, color: "from-yellow-600 to-yellow-400", completed: false, unlocked: true },
    { name: "Dry Out", difficulty: "Normal", stars: 2, color: "from-yellow-600 to-yellow-400", completed: false, unlocked: true },
    { name: "Base After Base", difficulty: "Hard", stars: 3, color: "from-orange-600 to-orange-400", completed: false, unlocked: true },
    { name: "Cant Let Go", difficulty: "Hard", stars: 3, color: "from-orange-600 to-orange-400", completed: false, unlocked: true },
    { name: "Jumper", difficulty: "Hard", stars: 3, color: "from-orange-600 to-orange-400", completed: false, unlocked: false },
    { name: "Time Machine", difficulty: "Harder", stars: 4, color: "from-red-600 to-red-400", completed: false, unlocked: false },
    { name: "Cycles", difficulty: "Harder", stars: 4, color: "from-red-600 to-red-400", completed: false, unlocked: false },
    { name: "xStep", difficulty: "Insane", stars: 5, color: "from-purple-600 to-purple-400", completed: false, unlocked: false },
    { name: "Clutterfunk", difficulty: "Insane", stars: 5, color: "from-purple-600 to-purple-400", completed: false, unlocked: false },
    { name: "Theory of Everything", difficulty: "Insane", stars: 5, color: "from-purple-600 to-purple-400", completed: false, unlocked: false },
    { name: "Electroman Adventures", difficulty: "Insane", stars: 5, color: "from-purple-600 to-purple-400", completed: false, unlocked: false },
    { name: "Clubstep", difficulty: "Demon", stars: 10, color: "from-red-900 to-red-700", completed: false, unlocked: false },
    { name: "Electrodynamix", difficulty: "Insane", stars: 5, color: "from-purple-600 to-purple-400", completed: false, unlocked: false },
    { name: "Hexagon Force", difficulty: "Insane", stars: 5, color: "from-purple-600 to-purple-400", completed: false, unlocked: false },
    { name: "Blast Processing", difficulty: "Harder", stars: 4, color: "from-red-600 to-red-400", completed: false, unlocked: false },
    { name: "Theory of Everything 2", difficulty: "Demon", stars: 10, color: "from-red-900 to-red-700", completed: false, unlocked: false },
    { name: "Geometrical Dominator", difficulty: "Harder", stars: 4, color: "from-red-600 to-red-400", completed: false, unlocked: false },
    { name: "Deadlocked", difficulty: "Demon", stars: 10, color: "from-red-900 to-red-700", completed: false, unlocked: false },
    { name: "Fingerdash", difficulty: "Insane", stars: 5, color: "from-purple-600 to-purple-400", completed: false, unlocked: false },
  ];
  
  // Пользовательские уровни
  const userLevels = [
    { name: "Cosmic Adventure", author: "PlayerX", difficulty: "Easy", stars: 2, color: "from-blue-600 to-blue-400", likes: 387, downloads: 1204 },
    { name: "Neon Galaxy", author: "DashMaster", difficulty: "Hard", stars: 4, color: "from-purple-600 to-purple-400", likes: 842, downloads: 3751 },
    { name: "Techno Chaos", author: "EpicCreator", difficulty: "Insane", stars: 6, color: "from-red-700 to-red-500", likes: 1253, downloads: 8924 },
    { name: "Crystal Caverns", author: "GeoGamer", difficulty: "Normal", stars: 3, color: "from-cyan-600 to-cyan-400", likes: 651, downloads: 2309 },
    { name: "Inferno Run", author: "FlameJumper", difficulty: "Demon", stars: 10, color: "from-red-900 to-red-700", likes: 2487, downloads: 15362 },
  ];
  
  // Анимация фоновых элементов
  const [backgroundElements, setBackgroundElements] = useState<
    Array<{ x: number; y: number; size: number; speed: number; color: string }>
  >([]);
  
  useEffect(() => {
    // Создаем фоновые элементы для параллакса
    const elements = [];
    for (let i = 0; i < 50; i++) {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-950 flex flex-col items-center justify-center overflow-hidden relative">
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
              <Button 
                variant="default" 
                className="w-full py-6 text-xl bg-green-500 hover:bg-green-600 transition-all hover:scale-105 shadow-lg shadow-green-500/50"
                onClick={() => setMenuState('levels')}
              >
                Играть
              </Button>
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
                onClick={() => setMenuState('icons')}
              >
                Иконки
              </Button>
              <Button 
                variant="outline" 
                className="w-full py-4 bg-blue-500/80 hover:bg-blue-600 border-white/20 text-white transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
                onClick={() => setMenuState('settings')}
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
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">5</span>
                </div>
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">2</span>
                </div>
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">7</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">❤️</span>
                </div>
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">🏆</span>
                </div>
                <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-black font-bold">🔑</span>
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
            
            {/* Категории уровней */}
            <div className="flex justify-center gap-2 mb-6">
              <Button
                variant={selectedCategory === 'official' ? "default" : "outline"}
                className={selectedCategory === 'official' ? "bg-blue-600" : "border-white/20 text-white"}
                onClick={() => setSelectedCategory('official')}
              >
                Официальные
              </Button>
              <Button
                variant={selectedCategory === 'user' ? "default" : "outline"}
                className={selectedCategory === 'user' ? "bg-green-600" : "border-white/20 text-white"}
                onClick={() => setSelectedCategory('user')}
              >
                Пользователя
              </Button>
              <Button
                variant={selectedCategory === 'featured' ? "default" : "outline"}
                className={selectedCategory === 'featured' ? "bg-purple-600" : "border-white/20 text-white"}
                onClick={() => setSelectedCategory('featured')}
              >
                Избранные
              </Button>
            </div>
            
            {/* Официальные уровни */}
            {selectedCategory === 'official' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                {officialLevels.map((level, idx) => (
                  <Link to="/play" key={idx} className={!level.unlocked ? "pointer-events-none" : ""}>
                    <div 
                      className={`bg-gradient-to-r ${level.color} p-4 rounded-lg shadow-lg hover:scale-105 transition-transform ${!level.unlocked ? "opacity-50" : ""}`}
                    >
                      <div className="text-lg font-bold text-white">{level.name}</div>
                      <div className="flex justify-between items-center mt-2">
                        <div className={`
                          ${level.difficulty === "Easy" ? "bg-yellow-400" : ""}
                          ${level.difficulty === "Normal" ? "bg-orange-400" : ""}
                          ${level.difficulty === "Hard" ? "bg-red-500" : ""}
                          ${level.difficulty === "Harder" ? "bg-red-600" : ""}
                          ${level.difficulty === "Insane" ? "bg-purple-500" : ""}
                          ${level.difficulty === "Demon" ? "bg-red-900" : ""}
                          text-black px-2 py-1 rounded-full text-xs font-bold
                        `}>
                          {[...Array(level.stars)].map((_, i) => "⭐").join("")} {level.difficulty}
                        </div>
                        <div className="text-white/80 text-sm">
                          {level.completed ? "✓ Completed" : level.unlocked ? `0/3 ⭐` : "🔒 Locked"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Пользовательские уровни */}
            {selectedCategory === 'user' && (
              <div className="grid grid-cols-1 gap-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                {userLevels.map((level, idx) => (
                  <Link to="/play" key={idx}>
                    <div className={`bg-gradient-to-r ${level.color} p-4 rounded-lg shadow-lg hover:scale-105 transition-transform`}>
                      <div className="text-lg font-bold text-white">{level.name}</div>
                      <div className="text-sm text-white/80 mb-2">by {level.author}</div>
                      <div className="flex justify-between items-center">
                        <div className={`
                          ${level.difficulty === "Easy" ? "bg-yellow-400" : ""}
                          ${level.difficulty === "Normal" ? "bg-orange-400" : ""}
                          ${level.difficulty === "Hard" ? "bg-red-500" : ""}
                          ${level.difficulty === "Insane" ? "bg-purple-500" : ""}
                          ${level.difficulty === "Demon" ? "bg-red-900" : ""}
                          text-black px-2 py-1 rounded-full text-xs font-bold
                        `}>
                          {[...Array(level.stars)].map((_, i) => "⭐").join("")} {level.difficulty}
                        </div>
                        <div className="flex gap-3 text-white/80 text-sm">
                          <span>❤️ {level.likes}</span>
                          <span>⬇️ {level.downloads}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <Button 
                  variant="default" 
                  className="w-full py-4 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 mt-2"
                >
                  Поиск уровней 🔍
                </Button>
              </div>
            )}
            
            {/* Избранные уровни */}
            {selectedCategory === 'featured' && (
              <div className="p-6 text-center">
                <div className="text-white text-lg mb-4">У вас пока нет избранных уровней</div>
                <div className="p-8 border-2 border-dashed border-white/20 rounded-lg mb-4">
                  <span className="text-6xl">⭐</span>
                  <p className="text-white/60 mt-4">Добавляйте уровни в избранное, чтобы быстро находить их здесь</p>
                </div>
                <Button 
                  variant="default" 
                  className="w-full py-4 bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30"
                  onClick={() => setSelectedCategory('user')}
                >
                  Найти интересные уровни
                </Button>
              </div>
            )}
          </div>
        )}
        
        {menuState === 'create' && (
          <div className="bg-black/40 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Редактор уровней</h2>
              <Button 
                variant="outline" 
                className="border-white/20 text-white"
                onClick={() => setMenuState('main')}
              >
                ← Назад
              </Button>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="default" 
                  className="w-full py-12 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50 text-xl"
                >
                  Создать новый уровень
                </Button>
                
                <Button 
                  variant="default" 
                  className="w-full py-12 bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50 text-xl"
                >
                  Продолжить редактирование
                </Button>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white text-lg mb-2">Мои уровни</h3>
                
                <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-lg hover:scale-105 transition-transform">
                    <div className="text-base font-bold text-white">My First Level</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-bold">В разработке</div>
                      <div className="text-white/80 text-xs">Обновлено: сегодня</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-3 rounded-lg hover:scale-105 transition-transform">
                    <div className="text-base font-bold text-white">Space Adventure</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="bg-green-400 text-black px-2 py-0.5 rounded-full text-xs font-bold">Опубликован</div>
                      <div className="text-white/80 text-xs">❤️ 23 | ⬇️ 78</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full py-4 border-white/20 text-white bg-purple-500/30 hover:bg-purple-500/50"
              >
                Обучение редактору уровней
              </Button>
            </div>
          </div>
        )}
        
        {menuState === 'icons' && (
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
              {/* Предпросмотр персонажа */}
              <div className="bg-black/30 p-6 rounded-lg flex flex-col items-center">
                <div 
                  className="w-24 h-24 bg-gradient-to-br rounded-md flex items-center justify-center mb-4 shadow-lg animate-bounce"
                  style={{ backgroundColor: colors[selectedColor].color }}
                >
                  <div className="text-5xl font-bold">
                    {selectedIcon === 0 && '◼'}
                    {selectedIcon === 1 && '◆'}
                    {selectedIcon === 2 && '☺'}
                    {selectedIcon === 3 && '😎'}
                    {selectedIcon === 4 && '😠'}
                    {selectedIcon === 5 && '🤖'}
                    {selectedIcon === 6 && '👻'}
                    {selectedIcon === 7 && '🛸'}
                  </div>
                </div>
                <div className="text-white text-lg mb-2">Ваш персонаж</div>
                <div className="text-white/60 text-sm">Разблокировано: {icons.filter(i => i.unlocked).length}/{icons.length} иконок, {colors.filter(c => c.unlocked).length}/{colors.length} цветов</div>
              </div>
              
              <div>
                <h3 className="text-white text-xl mb-3">Выбрать иконку</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
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
                        className="w-full h-full bg-gradient-to-br rounded-md flex items-center justify-center"
                        style={{ backgroundColor: colors[selectedColor].color }}
                      >
                        <div className="text-lg font-bold">
                          {idx === 0 && '◼'}
                          {idx === 1 && '◆'}
                          {idx === 2 && '☺'}
                          {idx === 3 && '😎'}
                          {idx === 4 && '😠'}
                          {idx === 5 && '🤖'}
                          {idx === 6 && '👻'}
                          {idx === 7 && '🛸'}
                        </div>
                        {!icon.unlocked && <div className="absolute">🔒</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-white text-xl mb-3">Выбрать цвет</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
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
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="default" 
                  className="py-4 bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/30"
                >
                  Магазин иконок 🛒
                </Button>
                <Button 
                  variant="default" 
                  className="py-4 bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30"
                >
                  Достижения 🏆
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {menuState === 'settings' && (
          <div className="bg-black/40 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Настройки</h2>
              <Button 
                variant="outline" 
                className="border-white/20 text-white"
                onClick={() => setMenuState('main')}
              >
                ← Назад
              </Button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white text-lg mb-3">Аудио</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Музыка</span>
                  <div className="flex gap-2 items-center">
                    <input type="range" min="0" max="100" defaultValue="80" className="w-32" />
                    <Button 
                      variant="ghost" 
                      className="p-2 h-auto"
                      onClick={toggleMusic}
                    >
                      {audioPlaying ? '🔊' : '🔇'}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Звуковые эффекты</span>
                  <div className="flex gap-2 items-center">
                    <input type="range" min="0" max="100" defaultValue="100" className="w-32" />
                    <Button 
                      variant="ghost" 
                      className="p-2 h-auto"
                    >
                      🔊
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white text-lg mb-3">Графика</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Качество графики</span>
                  <select className="bg-blue-900 text-white border border-blue-700 rounded p-1">
                    <option>Высокое</option>
                    <option>Среднее</option>
                    <option>Низкое</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Частицы</span>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white bg-blue-700"
                  >
                    Включены
                  </Button>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white text-lg mb-3">Управление</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Отзывчивость</span>
                  <input type="range" min="0" max="100" defaultValue="50" className="w-32" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Вибрация</span>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white"
                  >
                    Выключена
                  </Button>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white text-lg mb-3">Аккаунт</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Имя игрока</span>
                  <input type="text" defaultValue="Player" className="bg-blue-900 text-white border border-blue-700 rounded p-1" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Сохранение в облаке</span>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white bg-blue-700"
                  >
                    Включено
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="default" 
                className="w-full py-4 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 mt-2"
              >
                Сбросить настройки
              </Button>
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
      
      {/* Версия игры */}
      <div className="absolute bottom-2 right-2 text-white/50 text-xs">
        Geometry Dash v2.11
      </div>
    </div>
  );
};

export default Index;
