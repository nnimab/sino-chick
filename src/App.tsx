import React, { useState, useRef, useEffect } from 'react';
import { Hand } from 'lucide-react';

const IMAGES = ['/1.png', '/2.png', '/3.png', '/4.png'];

export default function App() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isScreaming, setIsScreaming] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio('/rubberchiken.mp3');
    // Preload
    audioRef.current.load();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleScreamStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default mobile behaviors like zooming
    setIsScreaming(true);
    
    // Play the audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
    }

    // Start animating through frames quickly
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCurrentFrame((prev) => {
        // Loop through them rapidly while held
        return (prev + 1) % IMAGES.length;
      });
    }, 100); // 10fps animation
  };

  const handleScreamEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsScreaming(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Stop the audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setCurrentFrame(0); // Return to default frame
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 font-sans touch-none selection:bg-transparent bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/bg.png)' }}
    >
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden flex flex-col items-center p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-amber-500 tracking-tight">永豐高爾夫球雞</h1>
          <p className="text-gray-500 font-medium">點擊並長按雞！</p>
        </div>

        <div className="w-full flex flex-col items-center space-y-6">
          <div 
            className="w-full aspect-square relative cursor-pointer transition-transform duration-75 select-none bg-amber-50/50 rounded-2xl"
            style={{ transform: isScreaming ? 'scale(0.95)' : 'scale(1)' }}
            onMouseDown={handleScreamStart}
            onMouseUp={handleScreamEnd}
            onMouseLeave={handleScreamEnd}
            onTouchStart={handleScreamStart}
            onTouchEnd={handleScreamEnd}
          >
            {IMAGES.map((src, index) => (
              <img 
                key={index}
                src={src} 
                alt="Screaming Chicken"
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-75 ${index === currentFrame ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            
            {/* Optional hit overlay indicator */}
            {isScreaming && (
               <div className="absolute inset-0 border-4 border-amber-400 rounded-2xl animate-pulse pointer-events-none" />
            )}
          </div>
          
          <div className="flex items-center gap-2 text-amber-500 font-bold animate-bounce mt-4">
             <Hand size={24} />
             <span>長按我看我尖叫！</span>
          </div>
        </div>
      </div>
    </div>
  );
}
