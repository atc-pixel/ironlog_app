import React from "react";
import Body from "@mjcdev/react-body-highlighter";

export default function BodyHeatmap({ colors, scale = 1 }) {
  
  // Renk Paleti (heatmapLogic.js ile uyumlu)
  const palette = [
    "#1e293b", // 1: Empty (Slate-800)
    "#ef4444", // 2: High Negative
    "#fb923c", // 3: Low Negative
    "#facc15", // 4: Neutral
    "#86efac", // 5: Low Positive
    "#22c55e"  // 6: High Positive
  ];

  const getIntensity = (hexColor) => {
    const index = palette.indexOf(hexColor);
    return index === -1 ? 1 : index + 1;
  };

  const safeColors = colors || {};

  // === DETAYLI GRUPLAMA (MAPPING) ===
  // heatmapLogic'ten gelen grup isimlerini -> Paketin SLUG ID'lerine çeviriyoruz
  const mapMuscleToSlugs = (groupName, intensity) => {
    const mapping = {
      // 1. Trapez
      trapezius: ["trapezius"],
      
      // 2. Sırt (Üst ve Alt)
      back: ["upper-back", "lower-back"],
      
      // 3. Göğüs
      chest: ["chest"],
      
      // 4. Pazu
      biceps: ["biceps"],
      
      // 5. Arka Kol
      triceps: ["triceps"],
      
      // 6. Ön Kol & Eller
      forearms: ["forearm", "hands"],
      
      // 7. Omuzlar (Ön ve Arka)
      shoulders: ["front-deltoids", "back-deltoids"],
      
      // 8. Karın
      abs: ["abs", "obliques"],
      
      // 9. Üst Bacak & Kalça (Squat grubu)
      legs: ["quadriceps", "hamstring", "gluteal", "adductor"],
      
      // 10. Baldır
      calves: ["calves"],
      
      // 11. Kaval & Ayak & Diz
      tibialis: ["tibialis", "feet", "knees"],
      
      // 12. Kafa & Boyun
      neck: ["head", "neck"]
    };

    const slugs = mapping[groupName] || [];
    return slugs.map(slug => ({ slug, intensity }));
  };

  // Tüm veriyi birleştir
  const data = [
    ...mapMuscleToSlugs("trapezius", getIntensity(safeColors.trapezius)),
    ...mapMuscleToSlugs("back", getIntensity(safeColors.back)),
    ...mapMuscleToSlugs("chest", getIntensity(safeColors.chest)),
    ...mapMuscleToSlugs("biceps", getIntensity(safeColors.biceps)),
    ...mapMuscleToSlugs("triceps", getIntensity(safeColors.triceps)),
    ...mapMuscleToSlugs("forearms", getIntensity(safeColors.forearms)),
    ...mapMuscleToSlugs("shoulders", getIntensity(safeColors.shoulders)),
    ...mapMuscleToSlugs("abs", getIntensity(safeColors.abs)),
    ...mapMuscleToSlugs("legs", getIntensity(safeColors.legs)),
    ...mapMuscleToSlugs("calves", getIntensity(safeColors.calves)),
    ...mapMuscleToSlugs("tibialis", getIntensity(safeColors.tibialis)),
    ...mapMuscleToSlugs("neck", getIntensity(safeColors.neck)),
  ];

  return (
    <div 
      className="flex justify-center items-center gap-2 select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* ÖN TARA (Anterior) */}
      <div className="flex flex-col items-center relative">
        <span className="absolute -top-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ÖN</span>
        <Body 
          data={data} 
          gender="male" 
          side="front" 
          scale={1} 
          colors={palette} 
        />
      </div>

      {/* ARKA TARA (Posterior) */}
      <div className="flex flex-col items-center relative">
        <span className="absolute -top-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ARKA</span>
        <Body 
          data={data} 
          gender="male" 
          side="back" 
          scale={1} 
          colors={palette} 
        />
      </div>
    </div>
  );
}