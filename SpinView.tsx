
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SpinViewProps {
  settings: AppSettings;
  onWin: (amount: number) => void;
  lastSpin?: string;
}

const SpinView: React.FC<SpinViewProps> = ({ settings, onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winAmount, setWinAmount] = useState<number | null>(null);

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setWinAmount(null);
    
    const randomDeg = 1800 + Math.floor(Math.random() * 360);
    const totalRotation = rotation + randomDeg;
    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      const earned = Math.floor(Math.random() * (settings.spinRewardMax - settings.spinRewardMin + 1)) + settings.spinRewardMin;
      setWinAmount(earned);
      onWin(earned);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 pt-8">
      <h2 className="text-2xl font-bold text-gray-800">Spin & Win</h2>
      
      <div className="relative w-64 h-64">
        {/* Pointer */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-10 w-4 h-8 bg-red-600 rounded-b-full shadow-md"></div>
        
        {/* Wheel Canvas Mock */}
        <div 
          className="w-full h-full rounded-full border-8 border-indigo-900 shadow-2xl overflow-hidden spin-wheel"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-full h-full relative" style={{ background: 'conic-gradient(#4f46e5 0% 12.5%, #818cf8 12.5% 25%, #4f46e5 25% 37.5%, #818cf8 37.5% 50%, #4f46e5 50% 62.5%, #818cf8 62.5% 75%, #4f46e5 75% 87.5%, #818cf8 87.5% 100%)' }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
               <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm" style={{ transform: `rotate(${deg}deg) translateY(-80px)` }}>
                 ৳ {Math.floor(Math.random() * 10) + 1}
               </div>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={spinning}
        onClick={handleSpin}
        className={`w-full max-w-xs py-4 rounded-2xl text-xl font-bold text-white shadow-lg transition-all active:scale-95 ${spinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 animate-pulse'}`}
      >
        {spinning ? 'Spinning...' : 'SPIN NOW!'}
      </button>

      {winAmount !== null && !spinning && (
        <div className="bg-green-50 text-green-700 px-6 py-4 rounded-xl border border-green-100 font-bold animate-bounce text-center">
          🎉 Congratulations! You won ৳ {winAmount}!
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        * You can spin once every 24 hours.
      </p>
    </div>
  );
};

export default SpinView;
