import React, { useState, useEffect } from "react";
import { Clock, X } from "./Icons"; // İkonları buradan çekiyoruz

export default function RestTimerOverlay({ totalTime, onComplete, onClose }) {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const addTime = (seconds) => {
    setTimeLeft((prev) => prev + seconds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-md rounded-t-3xl border-t border-slate-700 p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-blue-400">
            <Clock size={20} />
            <span className="font-bold uppercase text-sm tracking-widest">Dinlenme</span>
          </div>
          <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="text-8xl font-black text-white tabular-nums tracking-tighter">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000 ease-linear" style={{ width: `${100 - (timeLeft / totalTime) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => addTime(30)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold text-lg transition-colors">
            +30 Sn
          </button>
          <button onClick={onClose} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition-colors">
            Atla
          </button>
        </div>
      </div>
    </div>
  );
}