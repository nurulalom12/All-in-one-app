
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert } from 'lucide-react';

const SecurityLock: React.FC = () => {
  const { pinLock, setIsLocked, t } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleInput = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === pinLock) {
          setIsLocked(false);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const removeLast = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 bg-indigo-600 z-[200] flex flex-col items-center justify-center p-8 text-white">
      <div className="mb-12 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-white/20 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-3xl font-black mb-3">{t('locked')}</h1>
        <p className="text-indigo-100 text-sm font-medium">{t('enter_pin')}</p>
      </div>

      <div className={`flex gap-6 mb-16 ${error ? 'animate-shake text-rose-300' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-5 h-5 rounded-full border-2 border-white/50 transition-all duration-300 ${pin.length > i ? 'bg-white border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}`} 
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 w-full max-w-xs animate-in slide-in-from-bottom-10 delay-200">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num}
            onClick={() => handleInput(num.toString())}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-3xl font-black transition-all active:scale-75 backdrop-blur-sm"
          >
            {num}
          </button>
        ))}
        <div />
        <button 
          onClick={() => handleInput('0')}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-3xl font-black transition-all active:scale-75 backdrop-blur-sm"
        >
          0
        </button>
        <button 
          onClick={removeLast}
          className="w-16 h-16 flex items-center justify-center text-indigo-100 font-black text-sm uppercase tracking-widest hover:text-white transition-colors"
        >
          DEL
        </button>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default SecurityLock;
