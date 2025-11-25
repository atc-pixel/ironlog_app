import React from "react";
import Body from "@mjcdev/react-body-highlighter";

export default function BodyHeatmap({ colors, scale = 1 }) {
  
  const palette = [
    "#1e293b", // 1: Boş
    "#ef4444", // 2: Kırmızı
    "#fb923c", // 3: Turuncu
    "#facc15", // 4: Sarı
    "#86efac", // 5: Açık Yeşil
    "#22c55e"  // 6: Koyu Yeşil
  ];

  const getIntensity = (hexColor) => {
    const index = palette.indexOf(hexColor);
    return index === -1 ? 1 : index + 1;
  };

  const safeColors = colors || {};

  const mapMuscleToSlugs = (groupName, intensity) => {
    const mapping = {
      chest: ["chest", "front-deltoids"], 
      back: ["upper-back", "lower-back", "trapezius", "back-deltoids"], 
      arms: ["biceps", "triceps", "forearm"], 
      shoulders: ["front-deltoids", "back-deltoids", "trapezius"], 
      // Hem tekil hem çoğul ekledik (adductor/adductors)
      legs: ["quadriceps", "hamstring", "calves", "gluteal", "adductor", "adductors"], 
      abs: ["abs", "obliques"]
    };

    const slugs = mapping[groupName] || [];
    return slugs.map(slug => ({ slug, intensity }));
  };

  const data = [
    ...mapMuscleToSlugs("chest", getIntensity(safeColors.chest)),
    ...mapMuscleToSlugs("back", getIntensity(safeColors.back)),
    ...mapMuscleToSlugs("arms", getIntensity(safeColors.arms)),
    ...mapMuscleToSlugs("shoulders", getIntensity(safeColors.shoulders)),
    ...mapMuscleToSlugs("legs", getIntensity(safeColors.legs)),
    ...mapMuscleToSlugs("abs", getIntensity(safeColors.abs)),
  ];

  return (
    <div 
      className="flex justify-center items-center gap-10 select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      <div className="flex flex-col items-center relative">
        <span className="absolute -top-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ÖN</span>
        <Body data={data} gender="male" side="front" scale={1.5} colors={palette} />
      </div>

      <div className="flex flex-col items-center relative">
        <span className="absolute -top-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ARKA</span>
        <Body data={data} gender="male" side="back" scale={1.5} colors={palette} />
      </div>
    </div>
  );
}