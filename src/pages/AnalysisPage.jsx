import React, { useState, useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { ArrowLeft, TrendingUp } from "../components/Icons";
import BodyHeatmap from "../components/BodyHeatmap";
import { calculateMuscleHeatmap, HEATMAP_COLORS, EXERCISE_DB, GROUP_LABELS } from "../utils/heatmapLogic";

// --- RENK AÇIKLAMASI (LEGEND) ---
const Legend = () => (
  <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: HEATMAP_COLORS.highNegative}}></div>Düşüş</div>
    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: HEATMAP_COLORS.neutral}}></div>Sabit</div>
    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: HEATMAP_COLORS.highPositive}}></div>Artış</div>
  </div>
);

// --- GRAFİK BİLEŞENİ ---
const CloudChart = ({ data, color = "#3b82f6" }) => {
  if (!data || data.length === 0) return <div className="h-40 flex items-center justify-center text-slate-600 text-xs border border-slate-800/50 border-dashed rounded-xl bg-slate-900/20">Veri yok.</div>;
  
  const height = 200;
  const width = Math.max(300, data.length * 60);
  const paddingX = 40;
  const paddingY = 20;
  
  const chartPoints = data.map(d => {
      const weights = d.sets.map(s => Number(s.weight));
      return { ...d, maxVal: Math.max(...weights), minVal: Math.min(...weights), allWeights: weights };
  });
  
  const allMaxValues = chartPoints.map(d => d.maxVal);
  const allMinValues = chartPoints.map(d => d.minVal);
  const globalMax = Math.max(...allMaxValues) * 1.1;
  const globalMin = Math.min(...allMinValues) > 0 ? Math.min(...allMinValues) * 0.8 : 0;
  const valueRange = globalMax - globalMin;
  
  const yTicks = [0, 0.5, 1].map(r => globalMin + r * valueRange);
  
  const points = chartPoints.map((d, i) => {
      const x = paddingX + (i * ((width - paddingX - 20) / Math.max(1, data.length - 1)));
      const yMax = height - paddingY - ((d.maxVal - globalMin) / valueRange) * (height - 2 * paddingY);
      const yMin = height - paddingY - ((d.minVal - globalMin) / valueRange) * (height - 2 * paddingY);
      const yAll = d.allWeights.map(w => ({ y: height - paddingY - ((w - globalMin) / valueRange) * (height - 2 * paddingY), value: w }));
      return { x, yMax, yMin, yAll, ...d };
  });

  let cloudPath = "";
  points.forEach((p, i) => { cloudPath += i === 0 ? `M ${p.x},${p.yMax}` : ` L ${p.x},${p.yMax}`; });
  for (let i = points.length - 1; i >= 0; i--) { cloudPath += ` L ${points[i].x},${points[i].yMin}`; }
  cloudPath += " Z";
  
  const topLinePath = points.reduce((acc, p, i) => i === 0 ? `M ${p.x},${p.yMax}` : `${acc} L ${p.x},${p.yMax}`, "");

  return (
      <div className="w-full overflow-x-auto scrollbar-hide border border-slate-800 rounded-2xl bg-slate-900/50">
          <div style={{ width: '100%', minWidth: width }}>
              <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                  {yTicks.map((tickVal, i) => {
                      const y = height - paddingY - ((tickVal - globalMin) / valueRange) * (height - 2 * paddingY);
                      return (<g key={i}><line x1={paddingX} y1={y} x2={width} y2={y} stroke="#1e293b" strokeDasharray="4" strokeWidth="1" /><text x={paddingX - 10} y={y + 4} textAnchor="end" fill="#64748b" fontSize="9" fontWeight="500">{Math.round(tickVal)}</text></g>);
                  })}
                  <defs><linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.4" /><stop offset="100%" stopColor={color} stopOpacity="0.05" /></linearGradient></defs>
                  <path d={cloudPath} fill={`url(#grad-${color})`} stroke="none" />
                  <path d={topLinePath} fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.8" strokeDasharray="3 3" />
                  {points.map((day, i) => (
                      <g key={i}>
                          <line x1={day.x} y1={day.yMin} x2={day.x} y2={day.yMax} stroke={color} strokeWidth="1" opacity="0.3" />
                          {day.yAll.map((setPoint, idx) => (
                              <g key={idx}>
                                  <circle cx={day.x} cy={setPoint.y} r={setPoint.value === day.maxVal ? 4 : 2} fill={setPoint.value === day.maxVal ? "#fff" : color} stroke={color} strokeWidth={setPoint.value === day.maxVal ? 2 : 0} fillOpacity={setPoint.value === day.maxVal ? 1 : 0.5} />
                                  {setPoint.value === day.maxVal && (<text x={day.x} y={setPoint.y - 8} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" className="drop-shadow-md">{setPoint.value}</text>)}
                              </g>
                          ))}
                          <text x={day.x} y={height - 5} textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="500">{day.formattedDate}</text>
                      </g>
                  ))}
              </svg>
          </div>
      </div>
  );
};

export default function AnalysisPage({ onBack }) {
  const { history } = useWorkout();
  const [selectedGroup, setSelectedGroup] = useState("chest");
  
  const heatmapData = useMemo(() => calculateMuscleHeatmap(history), [history]);

  const getExerciseData = (exerciseName) => {
      if (!history) return [];
      const data = [];
      const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
      sortedHistory.forEach(day => {
          const exercise = day.exercises.find(e => e.name.trim() === exerciseName);
          if (exercise && exercise.sets.length > 0) {
              const dateObj = new Date(day.date);
              data.push({ date: day.date, formattedDate: `${dateObj.getDate()}/${dateObj.getMonth() + 1}`, sets: exercise.sets });
          }
      });
      return data;
  };

  const groupExercises = useMemo(() => {
      const potentialExercises = Object.keys(EXERCISE_DB).filter(exName => EXERCISE_DB[exName] === selectedGroup);
      const activeExercises = potentialExercises.filter(exName => {
          return history.some(day => day.exercises.some(e => e.name.trim() === exName));
      });
      return activeExercises;
  }, [history, selectedGroup]);

  return (
      // GÜNCELLEME 1: pt-14 (Üst boşluk) ve px-6 pb-6 (Yan/Alt boşluk)
      <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col px-6 pb-6 pt-14 overflow-hidden font-sans">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-4 flex-none">
              <button onClick={onBack} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
              <h1 className="text-2xl font-black text-white italic tracking-tight">ANALİZ</h1>
          </div>

          {/* GÜNCELLEME 2: overflow-x-hidden (Yatay kaymayı engelle) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-10 w-full">
              
              {/* BÖLÜM 1: VÜCUT ISI HARİTASI */}
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-5 mb-8 flex flex-col items-center w-full">
                 <BodyHeatmap colors={heatmapData.colors} scale={0.8} />
                 <Legend />
              </div>

              {/* BÖLÜM 2: KAS GRUBU SEÇİCİ */}
              <div className="mb-8 w-full">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Bölge Seç</h2>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full">
                      {Object.entries(GROUP_LABELS).map(([key, label]) => (
                          <button
                              key={key}
                              onClick={() => setSelectedGroup(key)}
                              className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-sm transition-all border flex-shrink-0 ${
                                  selectedGroup === key 
                                  ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/50 scale-105" 
                                  : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
                              }`}
                          >
                              {label}
                          </button>
                      ))}
                  </div>
              </div>

              {/* BÖLÜM 3: HAREKET GRAFİKLERİ */}
              <div className="space-y-10 w-full">
                  {groupExercises.length > 0 ? (
                      groupExercises.map(exerciseName => {
                          const data = getExerciseData(exerciseName);
                          const maxWeights = data.map(d => Math.max(...d.sets.map(s => Number(s.weight))));
                          const first = maxWeights[0] || 0;
                          const last = maxWeights[maxWeights.length - 1] || 0;
                          const progress = first > 0 ? ((last - first) / first) * 100 : 0;

                          return (
                              <div key={exerciseName} className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                                  <div className="flex justify-between items-end mb-3 px-1">
                                      <h3 className="text-lg font-black text-white truncate">{exerciseName}</h3>
                                      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${progress >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                          <TrendingUp size={14} />
                                          {progress > 0 ? '+' : ''}{progress.toFixed(1)}%
                                      </div>
                                  </div>
                                  <CloudChart data={data} color="#3b82f6" />
                              </div>
                          );
                      })
                  ) : (
                      <div className="text-center py-12 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800 w-full">
                          <p className="text-slate-500 text-sm font-medium">Bu bölge için henüz antrenman kaydı yok.</p>
                          <p className="text-slate-600 text-xs mt-1">Antrenman yaparak veri oluşturabilirsin.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
}