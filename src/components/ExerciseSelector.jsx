import React, { useState, useMemo } from "react";
import { Activity, ArrowLeft, X, ChevronRight, Plus } from "./Icons";
import { getGroupedExercises, GROUP_LABELS } from "../utils/heatmapLogic";

export default function ExerciseSelector({ isOpen, onClose, onSelect, customExercises }) {
  const [view, setView] = useState("groups"); // 'groups' veya 'exercises'
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const groupedData = useMemo(() => getGroupedExercises(), []);
  const groups = Object.keys(groupedData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {view === "exercises" ? (
            <button onClick={() => setView("groups")} className="bg-slate-800 p-2 rounded-xl text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
          ) : (
            <div className="bg-blue-500/20 p-2 rounded-xl text-blue-500"><Activity size={24} /></div>
          )}
          <h2 className="text-xl font-black text-white italic tracking-tight">
            {view === "groups" ? "BÖLGE SEÇ" : GROUP_LABELS[selectedGroup] || "ÖZEL"}
          </h2>
        </div>
        <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white"><X size={20} /></button>
      </div>

      {/* Liste İçeriği */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        
        {/* 1. ADIM: GRUPLAR */}
        {view === "groups" && (
          <div className="grid grid-cols-2 gap-3">
            {groups.map(groupKey => (
              <button 
                key={groupKey}
                onClick={() => { setSelectedGroup(groupKey); setView("exercises"); }}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-4 rounded-2xl text-left transition-all active:scale-95 group"
              >
                <div className="text-blue-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Activity size={20} />
                </div>
                <div className="font-bold text-white text-lg">{GROUP_LABELS[groupKey] || groupKey}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                  {groupedData[groupKey].length} Hareket
                </div>
              </button>
            ))}

            {/* Özel Hareketler Grubu */}
            <button 
                onClick={() => { setSelectedGroup("custom"); setView("exercises"); }}
                className="bg-indigo-900/20 hover:bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-2xl text-left transition-all active:scale-95 col-span-2 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-indigo-400 text-lg">Özel Hareketlerim</div>
                  <div className="text-[10px] font-bold text-indigo-300/50 uppercase tracking-wider mt-1">
                    {customExercises.length} Hareket
                  </div>
                </div>
                <ChevronRight size={20} className="text-indigo-500" />
            </button>
          </div>
        )}

        {/* 2. ADIM: HAREKETLER */}
        {view === "exercises" && (
          <div className="space-y-2">
            {(selectedGroup === "custom" ? customExercises : groupedData[selectedGroup])?.map((exercise, idx) => (
              <button 
                key={idx}
                onClick={() => { onSelect(exercise); onClose(); }}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.99] transition-all"
              >
                <span className="font-bold text-slate-200 text-lg">{exercise}</span>
                <div className="bg-slate-950 p-2 rounded-full text-slate-600 group-hover:text-green-400 group-hover:bg-green-500/10 transition-colors">
                  <Plus size={18} />
                </div>
              </button>
            ))}
            
            <button 
              onClick={() => { onSelect("➕ Yeni Hareket Ekle"); onClose(); }}
              className="w-full bg-slate-800/50 border border-dashed border-slate-700 p-4 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:border-slate-500 transition-all mt-4"
            >
              <Plus size={18} /> Başka Bir Hareket Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}