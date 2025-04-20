
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GDLogo from "@/components/game/GDLogo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-3xl text-center">
        <GDLogo className="mx-auto mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link to="/play">
            <Button variant="default" className="w-full py-6 text-xl bg-green-500 hover:bg-green-600 transition-all hover:scale-105">
              Играть
            </Button>
          </Link>
          <Link to="/create">
            <Button variant="default" className="w-full py-6 text-xl bg-purple-500 hover:bg-purple-600 transition-all hover:scale-105">
              Создать
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/levels">
            <Button variant="outline" className="w-full py-4 bg-blue-500/80 hover:bg-blue-600 border-white/20 text-white transition-all hover:scale-105">
              Уровни
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="outline" className="w-full py-4 bg-blue-500/80 hover:bg-blue-600 border-white/20 text-white transition-all hover:scale-105">
              Настройки
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="w-full py-4 bg-blue-500/80 hover:bg-blue-600 border-white/20 text-white transition-all hover:scale-105">
              Профиль
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full h-24 bg-black/40 flex items-center justify-center">
        <div className="animate-bounce bg-yellow-400 p-2 rounded-full">
          <Button 
            variant="ghost" 
            className="text-black font-bold"
            onClick={() => {
              // Play lobby music
              const audio = new Audio("/sounds/menuLoop.mp3");
              audio.loop = true;
              audio.play().catch(e => console.log("Audio playback prevented:", e));
            }}
          >
            🔊 Включить музыку
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
