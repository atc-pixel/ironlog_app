import React, { useState, useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext"; 
import { Calendar, ChevronRight, History, Trash2, Settings, Trophy } from "../components/Icons";
import { calculateMuscleHeatmap } from "../utils/heatmapLogic"; // Algoritma
import BodyHeatmap from "../components/BodyHeatmap"; // Görsel

export default function HomePage({ onStartWorkout, onOpenAnalysis, onOpenSettings }) {
  const { history, clearHistory } = useWorkout(); 
  
  const [expandedId, setExpandedId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Isı Haritası verilerini hesapla (Memoize et ki her renderda hesaplamasın)
  const heatmapData = useMemo(() => calculateMuscleHeatmap(history), [history]);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const handleClearHistory = () => {
    if (window.confirm("Tüm antrenman geçmişini silmek istediğine emin misin?")) clearHistory();
  };

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
       
       <div className="flex-none p-6 pb-0">
           <div className="mt-2 mb-6 flex justify-between items-start">
              <div>
                  <button onClick={onOpenSettings} className="mb-4 bg-slate-900 p-2.5 rounded-xl text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors"><Settings size={20} /></button>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-400 to-slate-600 italic tracking-tighter mb-1">IRONLOG</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Progressive Overload Assistant</p>
              </div>
              {history && history.length > 0 && (<button onClick={handleClearHistory} className="bg-slate-900 p-3 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-slate-800"><Trash2 size={20} /></button>)}
           </div>

           <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl mb-4">
              <div className="flex items-center gap-3 mb-5"><div className="bg-blue-600/20 p-3 rounded-xl text-blue-500"><Calendar size={24} /></div><div className="flex flex-col w-full"><span className="text-xs font-bold text-slate-500 uppercase">Tarih Seç</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-white font-bold text-xl outline-none w-full" /></div></div>
              <button onClick={() => onStartWorkout(date)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl font-black text-xl shadow-lg shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">ANTREMANA BAŞLA <ChevronRight size={24} strokeWidth={3} /></button>
           </div>

           {/* --- YENİ: VÜCUT DURUMU KARTI --- */}
           <div 
             onClick={onOpenAnalysis}
             className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-6 group transition-all cursor-pointer relative overflow-hidden"
           >
              {/* Arka plan parlaması */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

              <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg"><Trophy size={18} /></div>
                    <span className="font-bold text-sm text-slate-200">Vücut Analizi</span>
                 </div>
                 <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>

              <div className="flex items-center justify-between">
                 {/* Sol: Özet Metni */}
                 <div className="w-1/2 pr-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Durum</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                       Son 21 günde yapılan antrenmanlara göre kas gelişim haritan hazır. Detaylar için dokun.
                    </p>
                 </div>
                 
                 {/* Sağ: Mini Harita Önizleme */}
                 <div className="w-1/2 h-20 bg-slate-950/50 rounded-xl border border-slate-800/50 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute top-2">
                       <BodyHeatmap colors={heatmapData.colors} scale={0.4} />
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-2 mb-2 px-1 opacity-70"><History size={16} /><span className="text-xs font-bold uppercase tracking-widest">Son Antrenmanlar</span></div>
       </div>

       {/* Liste Alanı (Eski kodun aynısı, flex yapısı korundu) */}
       <div className="flex-1 min-h-0 overflow-y-auto pb-safe px-6">
          <div className="space-y-3 pb-32 pt-2">
             {(!history || history.length === 0) ? ( <div className="h-64 flex flex-col items-center justify-center text-slate-600 text-sm font-medium border-2 border-dashed border-slate-800/50 rounded-3xl bg-slate-900/20"><p>Henüz kayıtlı antrenman yok.</p><p className="text-xs mt-2 text-slate-700">İlk gününü başlat!</p></div> ) : ( history.map((item) => { const isExpanded = expandedId === item.id; return ( <div key={item.id} onClick={() => toggleExpand(item.id)} className={`bg-slate-900/50 rounded-2xl border border-slate-800 transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-slate-900 border-blue-500/30 shadow-lg' : ''}`}> <div className="p-4 flex items-center justify-between cursor-pointer"> <div> <div className={`font-bold text-lg mb-1 ${isExpanded ? 'text-blue-400' : 'text-white'}`}>{item.date}</div> <div className="text-xs text-slate-500 font-bold">{item.exercises.length} Hareket</div> </div> <div className={`bg-slate-800 p-2 rounded-lg text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-400 bg-blue-500/10' : ''}`}> <ChevronRight size={16} /> </div> </div> {isExpanded && ( <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-200"> <div className="h-px w-full bg-slate-800 mb-4"></div> <div className="space-y-4"> {item.exercises.map((ex, i) => ( <div key={i} className="flex flex-col gap-2"> <div className="flex justify-between items-center"> <span className="text-sm font-bold text-slate-300">{ex.name}</span> <span className="text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800"> {ex.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0)} KG Vol. </span> </div> <div className="flex flex-wrap gap-1.5"> {ex.sets.map((set, setIndex) => ( <div key={setIndex} className="bg-slate-800/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-slate-400"> <span className="text-slate-200 font-bold">{set.weight}</span> <span className="opacity-50 mx-0.5">x</span> <span className="text-slate-200 font-bold">{set.reps}</span> </div> ))} </div> </div> ))} </div> </div> )} </div> ); }) )}
          </div>
       </div>
    </div>
  );
}