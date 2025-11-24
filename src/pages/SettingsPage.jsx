import React from "react";
import { useWorkout } from "../context/WorkoutContext";
import { ArrowLeft, Clock, Settings, Check } from "../components/Icons";

export default function SettingsPage({ onBack }) {
  const { settings, updateSettings } = useWorkout();
  const timeOptions = [30, 60, 90, 120, 180];

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col p-6 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-black text-white italic tracking-tight flex items-center gap-2"><Settings size={24} className="text-blue-500" /> AYARLAR</h1>
      </div>
      <div className="space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${settings.restTimerEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}><Clock size={24} /></div>
              <div><h3 className="font-bold text-lg text-white">Dinlenme Sayacı</h3><p className="text-xs text-slate-500">Set sonrası otomatik başlat</p></div>
            </div>
            <button onClick={() => updateSettings({ restTimerEnabled: !settings.restTimerEnabled })} className={`w-14 h-8 rounded-full transition-colors relative ${settings.restTimerEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.restTimerEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
          {settings.restTimerEnabled && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="h-px w-full bg-slate-800 mb-4"></div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Varsayılan Süre (Saniye)</label>
              <div className="grid grid-cols-5 gap-2">
                {timeOptions.map((time) => (
                  <button key={time} onClick={() => updateSettings({ restTimerSeconds: time })} className={`py-3 rounded-xl font-bold text-sm transition-all border ${settings.restTimerSeconds === time ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/50' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>{time}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}