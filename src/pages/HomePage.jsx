import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext"; 
import { Calendar, ChevronRight, History, Trash2, TrendingUp, Settings } from "../components/Icons";

export default function HomePage({ onStartWorkout, onOpenAnalysis, onOpenSettings }) {
  const { history, clearHistory } = useWorkout(); 
  
  const [expandedId, setExpandedId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleClearHistory = () => {
    if (window.confirm("Tüm antrenman geçmişini silmek istediğine emin misin? Bu işlem geri alınamaz.")) {
      clearHistory();
    }
  };

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col p-6">
       
       {/* Üst Alan */}
       <div className="mt-8 mb-8 flex justify-between items-start">
          <div>
              <button 
                onClick={onOpenSettings}
                className="mb-4 bg-slate-900 p-2.5 rounded-xl text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Settings size={20} />
              </button>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-400 to-slate-600 italic tracking-tighter mb-2">
                IRONLOG
              </h1>
              {/* GÜNCELLENDİ: Assistant Yazısı */}
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Progressive Overload Assistant</p>
          </div>

          {history && history.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="bg-slate-900 p-3 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-slate-800"
            >
              <Trash2 size={20} />
            </button>
          )}
       </div>

       {/* Başlat Kartı */}
       <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-600/20 p-3 rounded-xl text-blue-500">
                <Calendar size={24} />
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase">Tarih Seç</span>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-white font-bold text-xl outline-none"
                />
             </div>
          </div>
          
          <button 
             onClick={() => onStartWorkout(date)}
             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-2xl font-black text-xl shadow-lg shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
          >
             ANTREMANA BAŞLA
             <ChevronRight size={24} strokeWidth={3} />
          </button>
       </div>

       <button 
          onClick={onOpenAnalysis}
          className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 p-4 rounded-2xl font-bold flex items-center justify-between mb-8 group transition-all"
       >
          <div className="flex items-center gap-3">
             <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
             </div>
             <span>Analiz</span>
          </div>
          <ChevronRight size={20} className="text-slate-500" />
       </button>

       {/* Liste Alanı */}
       <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4 opacity-70">
             <History size={16} />
             <span className="text-xs font-bold uppercase tracking-widest">Son Antrenmanlar</span>
          </div>
          
          {/* GÜNCELLENDİ: pb-32 ile alt tarafa ciddi bir boşluk bıraktık */}
          <div className="overflow-y-auto space-y-3 pb-32 scrollbar-hide h-full">
             {(!history || history.length === 0) ? (
                <div className="text-center text-slate-600 py-10 text-sm font-medium border-2 border-dashed border-slate-900 rounded-2xl">
                   Henüz kayıtlı antrenman yok. <br/> İlk gününü başlat!
                </div>
             ) : (
                history.map((item) => {
                  const isExpanded = expandedId === item.id;
                  
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => toggleExpand(item.id)}
                      className={`bg-slate-900/50 rounded-2xl border border-slate-800 transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-slate-900 border-blue-500/30 shadow-lg' : ''}`}
                    >
                       <div className="p-4 flex items-center justify-between cursor-pointer">
                          <div>
                             <div className={`font-bold text-lg mb-1 ${isExpanded ? 'text-blue-400' : 'text-white'}`}>{item.date}</div>
                             <div className="text-xs text-slate-500 font-bold">{item.exercises.length} Hareket</div>
                          </div>
                          <div className={`bg-slate-800 p-2 rounded-lg text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-400 bg-blue-500/10' : ''}`}>
                             <ChevronRight size={16} />
                          </div>
                       </div>

                       {isExpanded && (
                         <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                           <div className="h-px w-full bg-slate-800 mb-4"></div>
                           
                           <div className="space-y-4">
                             {item.exercises.map((ex, i) => (
                               <div key={i} className="flex flex-col gap-2">
                                 <div className="flex justify-between items-center">
                                   <span className="text-sm font-bold text-slate-300">{ex.name}</span>
                                   <span className="text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                     {ex.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0)} KG Vol.
                                   </span>
                                 </div>
                                 
                                 <div className="flex flex-wrap gap-1.5">
                                   {ex.sets.map((set, setIndex) => (
                                     <div key={setIndex} className="bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-slate-400">
                                       <span className="text-slate-200 font-bold">{set.weight}</span>
                                       <span className="opacity-50 mx-0.5">x</span>
                                       <span className="text-slate-200 font-bold">{set.reps}</span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                    </div>
                  );
                })
             )}
          </div>
       </div>
    </div>
  );
}