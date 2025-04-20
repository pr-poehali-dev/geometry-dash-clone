
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Geometry Dash</h1>
        <div className="text-white text-xl">Загрузка уровня...</div>
      </div>
      
      <div className="w-64 mb-8">
        <Progress value={progress} className="h-2" />
        <div className="text-white text-right mt-2">{progress}%</div>
      </div>
      
      <div className="flex gap-4">
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
      
      <div className="absolute bottom-4 text-white/60 text-sm animate-pulse">
        Нажмите пробел для прыжка
      </div>
    </div>
  );
};

export default LoadingScreen;
