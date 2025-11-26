import React, { useState, useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext"; 
import { Calendar, ChevronRight, History, Trash2, Settings, Trophy } from "../components/Icons";
import { calculateMuscleHeatmap } from "../utils/heatmapLogic"; 
import BodyHeatmap from "../components/BodyHeatmap"; 

// Yeni prop: onOpenHistory
export default function HomePage({ onStartWorkout, onOpenAnalysis, onOpenSettings, onOpenHistory }) {
  const { history, clearHistory } = useWorkout(); 
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const heatmapData = useMemo(() => calculateMuscleHeatmap(history), [history]);

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
       
       {/* Ana İçerik (Scroll edilebilir) */}
       <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
           
           {/* Üst Bar */}
           <div className="mt-2 mb-6 flex justify-between items-start">
              <div>
                  <button onClick={onOpenSettings} className="mb-4 bg-slate-900 p-2.5 rounded-xl text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors"><Settings size={20} /></button>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-400 to-slate-600 italic tracking-tighter mb-1">IRONLOG</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Progressive Overload Assistant</p>
              </div>
           </div>

           {/* Antrenmana Başla Kartı */}
           <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl mb-4">
              <div className="flex items-center gap-3 mb-5"><div className="bg-blue-600/20 p-3 rounded-xl text-blue-500"><Calendar size={24} /></div><div className="flex flex-col w-full"><span className="text-xs font-bold text-slate-500 uppercase">Tarih Seç</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-white font-bold text-xl outline-none w-full" /></div></div>
              <button onClick={() => onStartWorkout(date)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl font-black text-xl shadow-lg shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">ANTREMANA BAŞLA <ChevronRight size={24} strokeWidth={3} /></button>
           </div>

           {/* Analiz Kartı */}
           <div 
             onClick={onOpenAnalysis}
             className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-6 group transition-all cursor-pointer relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

              <div className="flex justify-between items-center mb-4 relative z-10">
                 <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg"><Trophy size={18} /></div>
                    <span className="font-bold text-sm text-slate-200">Analiz</span>
                 </div>
                 <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>

              <div className="w-full h-32 bg-slate-950/50 rounded-2xl border border-slate-800/50 flex items-center justify-center overflow-hidden relative">
                 <div className="mt-8 opacity-90 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500">
                    <BodyHeatmap colors={heatmapData.colors} scale={0.7} />
                 </div>
              </div>
           </div>
           
           {/* --- YENİ: GEÇMİŞ BUTONU (Liste yerine bu geldi) --- */}
           <div className="mt-8 mb-10">
              <div className="flex items-center gap-2 mb-3 px-1 opacity-70">
                <History size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Kayıtlar</span>
              </div>
              
              <button 
                onClick={onOpenHistory}
                className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between group hover:bg-slate-800 transition-all shadow-md"
              >
                <div className="flex items-center gap-4">
                   <div className="bg-slate-800 p-3 rounded-2xl text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                      <History size={24} />
                   </div>
                   <div className="text-left">
                      <div className="font-bold text-white text-lg">Antrenman Geçmişi</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-0.5">Tüm antrenmanları incele</div>
                   </div>
                </div>
                <div className="bg-slate-950 p-2 rounded-full text-slate-500 group-hover:text-white transition-colors">
                   <ChevronRight size={20} />
                </div>
              </button>
           </div>

       </div>
    </div>
  );
}