import React, { useState, useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { ArrowLeft, Trophy, Calendar, TrendingUp } from "../components/Icons";

const CloudChart = ({ data, color = "#3b82f6" }) => {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-500 text-sm border border-slate-800 border-dashed rounded-xl bg-slate-900/30">Henüz veri yok.</div>;
  const height = 300;
  const width = Math.max(350, data.length * 70);
  const paddingX = 50;
  const paddingY = 30;
  const chartPoints = data.map(d => {
      const weights = d.sets.map(s => Number(s.weight));
      return { ...d, maxVal: Math.max(...weights), minVal: Math.min(...weights), allWeights: weights };
  });
  const allMaxValues = chartPoints.map(d => d.maxVal);
  const allMinValues = chartPoints.map(d => d.minVal);
  const globalMax = Math.max(...allMaxValues) * 1.1;
  const globalMin = Math.min(...allMinValues) > 0 ? Math.min(...allMinValues) * 0.8 : 0;
  const valueRange = globalMax - globalMin;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => globalMin + r * valueRange);
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
                      return (<g key={i}><line x1={paddingX} y1={y} x2={width} y2={y} stroke="#1e293b" strokeDasharray="4" strokeWidth="1" /><text x={paddingX - 10} y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontWeight="500">{Math.round(tickVal)}</text></g>);
                  })}
                  <defs><linearGradient id="cloudGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.4" /><stop offset="100%" stopColor={color} stopOpacity="0.1" /></linearGradient></defs>
                  <path d={cloudPath} fill="url(#cloudGradient)" stroke="none" />
                  <path d={topLinePath} fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.5" strokeDasharray="2 2" />
                  {points.map((day, i) => (
                      <g key={i}>
                          <line x1={day.x} y1={day.yMin} x2={day.x} y2={day.yMax} stroke={color} strokeWidth="1" opacity="0.3" />
                          {day.yAll.map((setPoint, idx) => (
                              <g key={idx} className="group">
                                  <circle cx={day.x} cy={setPoint.y} r={setPoint.value === day.maxVal ? 5 : 3} fill={setPoint.value === day.maxVal ? "#fff" : color} stroke={color} strokeWidth={setPoint.value === day.maxVal ? 2 : 0} fillOpacity={setPoint.value === day.maxVal ? 1 : 0.7} />
                                  {setPoint.value === day.maxVal && (<text x={day.x} y={setPoint.y - 10} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" className="drop-shadow-md">{setPoint.value}</text>)}
                              </g>
                          ))}
                          <text x={day.x} y={height - 5} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500">{day.formattedDate}</text>
                      </g>
                  ))}
              </svg>
          </div>
      </div>
  );
};

export default function AnalysisPage({ onBack }) {
  const { history, customExercises } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState("Squat");
  const allExercises = ["Squat", "Bench Press", "Deadlift", "Overhead Press", "Barbell Row", "Lat Pulldown", "Leg Press", "Bicep Curl", ...customExercises];
  const processedData = useMemo(() => {
      if (!history) return [];
      const data = [];
      const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
      sortedHistory.forEach(day => {
          const exercise = day.exercises.find(e => e.name === selectedExercise);
          if (exercise && exercise.sets.length > 0) {
              const dateObj = new Date(day.date);
              data.push({ date: day.date, formattedDate: `${dateObj.getDate()}/${dateObj.getMonth() + 1}`, sets: exercise.sets });
          }
      });
      return data;
  }, [history, selectedExercise]);
  const allMaxWeights = processedData.map(d => Math.max(...d.sets.map(s => Number(s.weight))));
  const currentMaxWeight = allMaxWeights.length > 0 ? allMaxWeights[allMaxWeights.length - 1] : 0;
  const bestMaxWeight = allMaxWeights.length > 0 ? Math.max(...allMaxWeights) : 0;
  const firstWeight = allMaxWeights.length > 0 ? allMaxWeights[0] : 0;
  const progressPercent = firstWeight > 0 ? ((currentMaxWeight - firstWeight) / firstWeight) * 100 : 0;

  return (
      <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col p-6 overflow-hidden font-sans">
          <div className="flex items-center gap-4 mb-6">
              <button onClick={onBack} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
              <h1 className="text-2xl font-black text-white italic tracking-tight">ANALİZ</h1>
          </div>
          <div className="relative mb-6 z-20">
              <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} className="w-full bg-slate-900 text-white font-bold text-lg py-4 px-6 rounded-2xl border border-slate-800 focus:border-blue-500 outline-none appearance-none shadow-lg">{allExercises.map((ex) => <option key={ex} value={ex}>{ex}</option>)}</select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-10">
              <div className="mb-8">
                  <div className="flex justify-between items-center mb-4 px-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Çalışma Aralığı (Min-Max)</span>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${progressPercent >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}><TrendingUp size={14} />{progressPercent > 0 ? '+' : ''}{progressPercent.toFixed(1)}%</div>
                  </div>
                  <CloudChart data={processedData} color="#3b82f6" />
                  <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 border border-blue-500"></span> Max Set</div>
                      <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500/50"></span> Diğer Setler</div>
                      <div className="flex items-center gap-1"><span className="w-4 h-2 bg-blue-500/20 rounded"></span> Çalışma Aralığı</div>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800"><div className="text-xs font-bold text-slate-500 uppercase mb-1">Son Seans Max</div><div className="text-3xl font-black text-white">{currentMaxWeight} <span className="text-sm font-normal text-slate-600">kg</span></div><div className="text-[10px] text-slate-500 mt-1">Son antrenman zirvesi</div></div>
                  <div className="bg-gradient-to-br from-yellow-900/20 to-slate-900 rounded-2xl p-4 border border-yellow-500/20 relative overflow-hidden"><div className="absolute right-2 top-2 text-yellow-500/20"><Trophy size={48} /></div><div className="text-xs font-bold text-yellow-500 uppercase mb-1">Rekor</div><div className="text-3xl font-black text-white">{bestMaxWeight} <span className="text-sm font-normal text-slate-600">kg</span></div><div className="text-[10px] text-slate-500 mt-1">Şimdiye kadarki en iyi</div></div>
              </div>
          </div>
      </div>
  );
};