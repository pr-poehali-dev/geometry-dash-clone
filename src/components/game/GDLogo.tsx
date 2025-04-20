
import { FC } from "react";

interface GDLogoProps {
  className?: string;
}

const GDLogo: FC<GDLogoProps> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Тень логотипа */}
      <div className="absolute w-full h-full blur-md bg-cyan-500/50 -bottom-2 left-2 rounded-xl"></div>
      
      {/* Фон логотипа */}
      <div className="relative bg-gradient-to-br from-blue-600 to-cyan-400 p-4 rounded-xl border-4 border-white/50 shadow-2xl">
        <div className="flex items-center justify-center">
          {/* Иконка куба */}
          <div className="relative mr-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rotate-45 transform transition-transform duration-300 hover:rotate-[225deg]">
              {/* Детали куба */}
              <div className="absolute inset-0 border-2 border-pink-300/50"></div>
              <div className="absolute left-0 top-0 w-full h-2 bg-pink-300/30"></div>
              <div className="absolute left-0 top-0 w-2 h-full bg-pink-300/30"></div>
            </div>
            
            {/* Блики на кубе */}
            <div className="absolute w-3 h-3 bg-white/50 rounded-full top-1 left-1"></div>
          </div>
          
          {/* Текст логотипа */}
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              GEOMETRY
            </h1>
            <h2 className="text-4xl font-black text-white tracking-tighter leading-none">
              DASH
            </h2>
          </div>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rotate-12 transform"
             style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-cyan-300 -rotate-12 transform"
             style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
      </div>
    </div>
  );
};

export default GDLogo;
