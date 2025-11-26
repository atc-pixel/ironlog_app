import React, { useState, useMemo, useEffect } from "react";
import { Activity, X, Plus, Check } from "./Icons";
import { getGroupedExercises, GROUP_LABELS } from "../utils/heatmapLogic";

export default function ExerciseSelector({ isOpen, onClose, onSelect, customExercises }) {
  // İlk açılışta "Göğüs" (chest) veya varsa "Özel" (custom) seçili gelsin
  const [selectedGroup, setSelectedGroup] = useState("chest");
  
  // Veriyi hazırla
  const groupedData = useMemo(() => getGroupedExercises(), []);
  
  // Grup listesi (Sıralama: Özel -> Diğerleri)
  const groups = ["custom", ...Object.keys(groupedData)];

  // "Özel" grubu için etiket tanımla
  const getLabel = (key) => key === "custom" ? "Özel" : (GROUP_LABELS[key] || key);

  // Aktif grubun hareket listesini belirle
  const activeList = selectedGroup === "custom" ? customExercises : groupedData[selectedGroup];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
      
      {/* --- HEADER & YATAY TABLAR --- */}
      <div className="bg-slate-900 border-b border-slate-800 shadow-2xl z-20">
        {/* Başlık & Kapat Butonu */}
        {/* GÜNCELLEME: pt-6 yerine pt-14 yapıldı (Safe Area) */}
        <div className="flex items-center justify-between px-6 pt-14 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-xl text-blue-500">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white italic tracking-tight">HAREKET SEÇ</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kategori Filtreli</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* YATAY ŞERİT (TABS) */}
        <div className="flex overflow-x-auto px-4 pb-0 scrollbar-hide gap-2">
          {groups.map((groupKey) => {
            const isActive = selectedGroup === groupKey;
            return (
              <button
                key={groupKey}
                onClick={() => setSelectedGroup(groupKey)}
                className={`
                  flex-none px-5 py-3 rounded-t-2xl font-bold text-sm transition-all relative top-[1px] border-t border-x
                  ${isActive 
                    ? "bg-slate-950 text-blue-400 border-slate-800 border-b-slate-950 z-10" 
                    : "bg-slate-900/50 text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800"}
                `}
              >
                {getLabel(groupKey)}
                {/* Adet Rozeti */}
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-600"}`}>
                  {groupKey === "custom" ? customExercises.length : groupedData[groupKey]?.length || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- LİSTE ALANI --- */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide bg-slate-950">
        <div className="space-y-2 pb-10">
          
          {/* HAREKET LİSTESİ */}
          {activeList && activeList.length > 0 ? (
            activeList.map((exercise, idx) => (
              <button 
                key={idx}
                onClick={() => { onSelect(exercise); onClose(); }}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.99] transition-all"
              >
                <span className="font-bold text-slate-200 text-lg text-left">{exercise}</span>
                <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-all">
                  <Plus size={18} />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 opacity-50">
              <p className="text-slate-500 font-bold">Bu grupta hareket yok.</p>
            </div>
          )}

          {/* "YENİ EKLE" BUTONU (Listenin En Altında) */}
          <button 
            onClick={() => { onSelect("➕ Yeni Hareket Ekle"); onClose(); }}
            className="w-full mt-4 border-2 border-dashed border-slate-800 p-4 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-white hover:border-slate-600 hover:bg-slate-900/50 transition-all"
          >
            <Plus size={18} /> Başka Bir Hareket Ekle
          </button>

        </div>
      </div>
    </div>
  );
}