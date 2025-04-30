
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full py-4 px-6 flex justify-between items-center z-10 bg-dark-secondary/60 backdrop-blur-md",
      className
    )}>
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          <span className="text-matrix glow-effect">SOLO</span>-NATION
        </h1>
        <div className="h-6 w-[1px] bg-matrix/40"></div>
        <span className="text-sm uppercase tracking-widest text-matrix/80">Viewing Room</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#" className="text-white/70 hover:text-matrix transition-colors duration-300">Home</a>
        <a href="#" className="text-white/70 hover:text-matrix transition-colors duration-300">About</a>
        <a href="#" className="text-white/70 hover:text-matrix transition-colors duration-300">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
