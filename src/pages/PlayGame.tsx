
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameEngine from "@/components/game/GameEngine";
import LoadingScreen from "@/components/game/LoadingScreen";

const PlayGame = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = () => {
    setGameStarted(true);
    
    // Focus the game container for keyboard inputs
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };

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
        <div className="text-white font-bold">Stereo Madness</div>
        <Button 
          variant="outline" 
          className="text-white border-white/30"
          onClick={() => window.location.reload()}
        >
          Рестарт
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!gameStarted ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Готов играть?</h2>
            <Button 
              onClick={handleStartGame}
              className="bg-green-500 hover:bg-green-600 text-white text-xl py-6 px-12 rounded-xl animate-pulse"
            >
              Начать!
            </Button>
          </div>
        ) : (
          <div 
            ref={gameContainerRef}
            tabIndex={0} 
            className="w-full max-w-4xl h-[80vh] border-4 border-cyan-500 rounded-lg bg-black focus:outline-none"
          >
            <GameEngine />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayGame;
