import React, { useState } from "react";
import WheelPicker from "../components/WheelPicker";
import { useWorkout } from "../context/WorkoutContext"; 
import { Activity, Plus, Check, Save, Trash2, History, ArrowLeft, ChevronRight } from "../components/Icons";

// --- YENİ BİLEŞENLERİ ÇAĞIRIYORUZ ---
import RestTimerOverlay from "../components/RestTimerOverlay";
import ExerciseSelector from "../components/ExerciseSelector";
import WorkoutFinishScreen from "../components/WorkoutFinishScreen";

export default function WorkoutPage({ onFinishAndExit, initialDate }) {
  const { saveWorkout, history, customExercises, addCustomExercise, settings } = useWorkout(); 
  
  const [workoutLog, setWorkoutLog] = useState(() => {
    const existingDay = history.find(h => h.date === initialDate);
    return existingDay ? existingDay.exercises : [];
  });

  // State Yönetimi
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("Squat");
  const [isAddingNewExercise, setIsAddingNewExercise] = useState(false); 
  const [newExerciseName, setNewExerciseName] = useState(""); 

  const [currentSets, setCurrentSets] = useState([]);
  const [baseWeight, setBaseWeight] = useState(40);
  const [hasMicroLoad, setHasMicroLoad] = useState(false);
  const [reps, setReps] = useState(10);
  const [isFinished, setIsFinished] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const weightOptions = Array.from({ length: 41 }, (_, i) => i * 5); 
  const repOptions = Array.from({ length: 28 }, (_, i) => i + 3); 

  // --- FONKSİYONLAR ---

  const handleExerciseSelect = (exerciseName) => {
    if (exerciseName === "➕ Yeni Hareket Ekle") {
      setIsAddingNewExercise(true);
      setSelectedExercise(""); 
    } else {
      setIsAddingNewExercise(false);
      setSelectedExercise(exerciseName);
      setCurrentSets([]);
    }
  };

  const saveNewExercise = () => {
    if (newExerciseName.trim()) {
      addCustomExercise(newExerciseName.trim()); 
      setSelectedExercise(newExerciseName.trim()); 
      setIsAddingNewExercise(false); 
      setNewExerciseName(""); 
    }
  };

  const cancelNewExercise = () => {
    setIsAddingNewExercise(false);
    setSelectedExercise("Squat"); 
  };

  const addSet = () => {
    const finalWeight = hasMicroLoad ? baseWeight + 2.5 : baseWeight;
    const newSet = { id: Date.now(), weight: finalWeight, reps: reps };
    setCurrentSets([...currentSets, newSet]);
    if (settings.restTimerEnabled) setIsTimerActive(true);
  };

  const finishExercise = () => {
    if (currentSets.length === 0) return;
    setWorkoutLog(prevLog => {
      const existingIndex = prevLog.findIndex(ex => ex.name === selectedExercise);
      if (existingIndex !== -1) {
        const updatedLog = [...prevLog];
        updatedLog[existingIndex] = { ...updatedLog[existingIndex], sets: [...updatedLog[existingIndex].sets, ...currentSets] };
        return updatedLog;
      } else {
        return [...prevLog, { id: Date.now(), name: selectedExercise, sets: currentSets }];
      }
    });
    setCurrentSets([]);
  };

  const removeSet = (id) => setCurrentSets(currentSets.filter((set) => set.id !== id));
  const removeCompletedExercise = (exerciseId) => { setWorkoutLog(workoutLog.filter(ex => ex.id !== exerciseId)); };

  const saveAndExit = () => {
    saveWorkout({ date: initialDate, exercises: workoutLog, id: Date.now() });
    onFinishAndExit();
  };

  // Geçmiş Verileri Hesapla
  const exerciseHistory = history
    ? history.map(day => {
        const found = day.exercises.find(e => e.name === selectedExercise);
        if (day.date === initialDate) return null; 
        return found ? { date: day.date, sets: found.sets } : null;
      }).filter(Boolean) 
    : [];

  // İstatistikler
  const totalSets = workoutLog.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalVolume = workoutLog.reduce((acc, ex) => acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0), 0);

  // --- 1. DURUM: BİTİŞ EKRANI ---
  if (isFinished) {
    return (
      <WorkoutFinishScreen 
        date={initialDate}
        totalSets={totalSets}
        totalVolume={totalVolume}
        onSave={saveAndExit}
      />
    );
  }

  // --- 2. DURUM: ANTREMAN SAYFASI ---
  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 font-sans flex flex-col overflow-hidden">
      
      {/* Dinlenme Sayacı (Overlay) */}
      {isTimerActive && (
        <RestTimerOverlay 
          totalTime={settings.restTimerSeconds} 
          onComplete={() => setIsTimerActive(false)} 
          onClose={() => setIsTimerActive(false)} 
        />
      )}
      
      {/* Hareket Seçici Modalı */}
      <ExerciseSelector 
        isOpen={isSelectorOpen} 
        onClose={() => setIsSelectorOpen(false)} 
        onSelect={handleExerciseSelect}
        customExercises={customExercises}
      />

      {/* Header */}
      <header className="flex-none px-4 pt-6 pb-2 flex items-center justify-between bg-slate-950 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onFinishAndExit} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white active:scale-95 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic tracking-tighter antialiased leading-none">IRONLOG</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">{initialDate}</p>
          </div>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <Activity size={20} className="text-blue-500" />
        </div>
      </header>
      
      {/* Ana İçerik */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-safe px-4 space-y-6 scrollbar-hide">
         
         {/* Hareket Seçimi Butonu / Yeni Ekleme Alanı */}
         <div className="mt-2">
            {!isAddingNewExercise ? (
              <button 
                onClick={() => setIsSelectorOpen(true)} 
                className="w-full bg-slate-900 text-white font-bold text-xl py-4 px-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg transition-all active:scale-[0.98]"
              >
                <span className="truncate">{selectedExercise}</span>
                <div className="bg-blue-600 text-white p-1.5 rounded-lg"><ChevronRight size={20} className="rotate-90" /></div>
              </button>
            ) : (
              <div className="bg-slate-900 p-4 rounded-2xl border border-blue-500/50 shadow-lg animate-in fade-in slide-in-from-top-2">
                 <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Yeni Hareket İsmi</label>
                 <input type="text" autoFocus value={newExerciseName} onChange={(e) => setNewExerciseName(e.target.value)} placeholder="Örn: Triceps Pushdown" className="w-full bg-slate-950 text-white font-bold text-lg p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none mb-3" />
                 <div className="flex gap-3">
                    <button onClick={cancelNewExercise} className="flex-1 bg-slate-800 text-slate-400 py-3 rounded-xl font-bold text-sm">İptal</button>
                    <button onClick={saveNewExercise} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm">Ekle</button>
                 </div>
              </div>
            )}
         </div>

         {/* Veri Giriş Alanı */}
         {!isAddingNewExercise && (
            <>
              {/* Wheel Pickers */}
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-5 backdrop-blur-sm mt-6">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col items-center">
                          <WheelPicker label="AĞIRLIK (KG)" items={weightOptions} selectedValue={baseWeight} onSelect={setBaseWeight} />
                          <button onClick={() => setHasMicroLoad(!hasMicroLoad)} className={`mt-4 w-full h-12 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 border antialiased ${hasMicroLoad ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/50" : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"}`}>
                              {hasMicroLoad ? <Check size={18} /> : <Plus size={18} />} +2.5 KG
                          </button>
                      </div>
                      <div className="flex flex-col h-full justify-between">
                          <WheelPicker label="TEKRAR" items={repOptions} selectedValue={reps} onSelect={setReps} />
                          <div className="h-12 flex items-center justify-center"><span className="text-xs font-bold text-slate-500 tracking-wider antialiased">HEDEF: 8-12</span></div>
                      </div>
                  </div>
                  <button onClick={addSet} className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-[0.98] text-white h-16 rounded-2xl font-black text-xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 uppercase tracking-wide antialiased">
                      <Plus size={28} strokeWidth={4} /> Seti Ekle
                  </button>
              </div>

              {/* Aktif Set Listesi */}
              {currentSets.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 mt-6">
                      <div className="flex items-center justify-between mb-3 px-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest antialiased">Mevcut Setler</span>
                          <span className="text-xs font-bold text-blue-400 antialiased">{currentSets.length} Set</span>
                      </div>
                      <div className="space-y-3">
                          {currentSets.map((set, index) => (
                              <div key={set.id} className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
                                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                                  <div className="flex items-center gap-5 pl-2">
                                      <span className="text-slate-500 font-bold text-lg opacity-50 antialiased">#{index + 1}</span>
                                      <div className="flex items-baseline gap-1"><span className="text-2xl font-black text-white antialiased">{set.weight}</span><span className="text-xs font-bold text-slate-500 antialiased">KG</span></div>
                                      <div className="w-px h-8 bg-slate-800"></div>
                                      <div className="flex items-baseline gap-1"><span className="text-2xl font-black text-blue-400 antialiased">{set.reps}</span><span className="text-xs font-bold text-slate-500 antialiased">TEKRAR</span></div>
                                  </div>
                                  <button onClick={() => removeSet(set.id)} className="p-3 text-slate-600 hover:text-red-500 active:scale-90 transition-transform"><Trash2 size={20} /></button>
                              </div>
                          ))}
                      </div>
                      <button onClick={finishExercise} className="w-full mt-4 bg-slate-800 text-green-400 border border-green-500/20 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800/80 active:scale-[0.98] transition-all antialiased">
                          <Save size={20} /> Hareketi Tamamla
                      </button>
                  </div>
              )}

              {/* Geçmiş Veriler */}
              {exerciseHistory.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-3 px-2 opacity-80">
                        <div className="bg-yellow-500/20 p-1.5 rounded text-yellow-500"><History size={14} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedExercise} Geçmişi</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
                        {exerciseHistory.map((day, idx) => (
                          <div key={idx} className="flex-none w-40 bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                              <div className="text-[10px] font-bold text-slate-500 border-b border-slate-800 pb-1 mb-1">{day.date}</div>
                              <div className="space-y-1">
                                {day.sets.map((s, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs">
                                      <span className="text-slate-300 font-bold">{s.weight}kg</span>
                                      <span className="text-slate-500">x{s.reps}</span>
                                    </div>
                                ))}
                              </div>
                          </div>
                        ))}
                    </div>
                  </div>
              )}

              {/* Tamamlananlar Listesi */}
              {workoutLog.length > 0 && (
                  <div className="pb-10 mt-6">
                      <div className="flex items-center gap-3 mb-4 mt-8">
                          <Check size={16} className="text-green-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-slate-500 antialiased">Bugün Tamamlananlar</span>
                      </div>
                      <div className="space-y-4">
                          {workoutLog.map((ex) => (
                              <div key={ex.id} className="bg-slate-900 rounded-3xl p-5 border border-slate-800">
                                  <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                                      <h3 className="font-bold text-xl text-white tracking-tight antialiased">{ex.name}</h3>
                                      <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full antialiased">{ex.sets.length} SET</span>
                                          <button onClick={() => removeCompletedExercise(ex.id)} className="bg-slate-800 p-1.5 rounded-full text-red-400 hover:bg-red-500/20">
                                            <Trash2 size={14} />
                                          </button>
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2">
                                      {ex.sets.map((s, i) => (
                                          <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl py-3 flex flex-col items-center justify-center">
                                              <span className="text-lg font-black text-white leading-none antialiased">{s.weight}</span>
                                              <span className="text-[10px] font-bold text-slate-500 mt-1 antialiased">x {s.reps}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                      <button onClick={() => setIsFinished(true)} className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black text-lg shadow-xl shadow-green-900/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                          <Check size={24} strokeWidth={3} /> GÜNÜ TAMAMLA
                      </button>
                  </div>
              )}
            </>
         )}
      </div>
    </div>
  );
}