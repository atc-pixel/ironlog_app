import React from "react";
import Body from "@mjcdev/react-body-highlighter";

export default function BodyHeatmap({ colors, scale = 1 }) {
  // --- 1. RENK PALETİ ---
  // heatmapLogic.js'den gelen renk kodlarını, bileşenin anlayacağı
  // renk dizisi sırasına çeviriyoruz.
  
  const palette = [
    "#1e293b", // Varsayılan/Boş (Slate-800)
    "#ef4444", // Kırmızı (Düşüş)
    "#fb923c", // Turuncu
    "#facc15", // Sarı (Nötr)
    "#86efac", // Açık Yeşil
    "#22c55e"  // Koyu Yeşil (Yüksek Artış)
  ];

  // Renk kodunu Intensity (1-5) değerine çeviren yardımcı fonksiyon
  const getIntensity = (hexColor) => {
    const index = palette.indexOf(hexColor);
    // Eğer renk palette yoksa (veya undefined ise) varsayılan (0. index) olsun
    // Intensity, paletteki index + 1 olarak çalışır (1 tabanlı)
    return index === -1 ? 1 : index + 1; 
  };

  const safeColors = colors || {};

  // --- 2. MAPPING (EŞLEŞTİRME) ---
  // Ironlog kas gruplarını -> Paketin "slug" isimlerine çeviriyoruz.
  // Paket "chest", "upper-back" gibi spesifik isimler bekliyor.
  
  const mapMuscleToSlugs = (groupName, intensity) => {
    const mapping = {
      chest: ["chest"], // 'pectorals' yerine 'chest'
      back: ["trapezius", "upper-back", "lower-back"],
      arms: ["biceps", "triceps", "forearm", "front-deltoids", "back-deltoids"],
      shoulders: ["front-deltoids", "back-deltoids", "trapezius"],
      legs: ["quadriceps", "calves", "hamstring", "gluteal", "adductor"], // 'adductors' değil 'adductor'
      abs: ["abs", "obliques"]
    };

    const slugs = mapping[groupName] || [];
    return slugs.map(slug => ({ slug, intensity }));
  };

  // --- 3. VERİ OLUŞTURMA ---
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
      {/* ÖN TARA (ANTERIOR) */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">ÖN</span>
        <Body 
          data={data} 
          gender="male" 
          side="front" 
          scale={1.5} 
          colors={palette} 
        />
      </div>

      {/* ARKA TARA (POSTERIOR) */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">ARKA</span>
        <Body 
          data={data} 
          gender="male" 
          side="back" 
          scale={1.5} 
          colors={palette} 
        />
      </div>
    </div>
  );
}