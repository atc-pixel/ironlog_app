import React from "react";
import { Trophy } from "./Icons";

export default function WorkoutFinishScreen({ date, totalSets, totalVolume, onSave }) {
  return (
    <div className="h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
      <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
      <h2 className="text-4xl font-black text-white italic mb-2">HARİKA!</h2>
      <p className="text-slate-400 mb-8 text-center">{date} tarihli antrenman güncellendi.</p>
      
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <div className="bg-slate-900 p-4 rounded-2xl text-center border border-slate-800">
          <div className="text-3xl font-black text-white">{totalSets}</div>
          <div className="text-xs font-bold text-slate-500 uppercase">Toplam Set</div>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl text-center border border-slate-800">
          <div className="text-3xl font-black text-white">{(totalVolume / 1000).toFixed(1)}k</div>
          <div className="text-xs font-bold text-slate-500 uppercase">Hacim (KG)</div>
        </div>
      </div>

      <button 
        onClick={onSave} 
        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl text-xl shadow-lg shadow-green-900/50 transition-all active:scale-[0.98]"
      >
        Kaydet ve Çık
      </button>
    </div>
  );
}