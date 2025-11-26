import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { ArrowLeft, ChevronRight, Trash2 } from "../components/Icons";

export default function HistoryPage({ onBack }) {
  const { history, clearHistory } = useWorkout();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const handleClearHistory = () => {
    if (window.confirm("Tüm antrenman geçmişini silmek istediğine emin misin?")) clearHistory();
  };

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* GÜNCELLEME: pt-14 (Safe Area) */}
      <div className="flex items-center justify-between px-6 pb-4 pt-14 bg-slate-950 z-10 border-b border-slate-900/50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-white italic tracking-tight">GEÇMİŞ</h1>
        </div>
        {history && history.length > 0 && (
          <button onClick={handleClearHistory} className="bg-slate-900 p-3 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-slate-800">
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-safe px-6 scrollbar-hide">
        <div className="space-y-3 pb-10 pt-6">
          {(!history || history.length === 0) ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-600 text-sm font-medium border-2 border-dashed border-slate-800/50 rounded-3xl bg-slate-900/20">
              <p>Henüz kayıtlı antrenman yok.</p>
            </div>
          ) : (
            history.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} onClick={() => toggleExpand(item.id)} className={`bg-slate-900/50 rounded-2xl border border-slate-800 transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-slate-900 border-blue-500/30 shadow-lg' : ''}`}>
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