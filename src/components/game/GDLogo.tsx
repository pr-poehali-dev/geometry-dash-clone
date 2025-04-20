
import { cn } from "@/lib/utils";

interface GDLogoProps {
  className?: string;
}

const GDLogo = ({ className }: GDLogoProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="text-6xl md:text-7xl font-bold text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Geometry Dash
        </span>
      </div>
      <div className="absolute -top-6 -right-6 bg-red-500 text-white text-xs px-2 py-1 rounded-full transform rotate-12 animate-pulse">
        Web Edition
      </div>
      <div className="w-full flex justify-center mt-4 gap-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="w-8 h-8 bg-yellow-400 rounded animate-bounce" 
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default GDLogo;
