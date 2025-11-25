import React from "react";

export default function BodyHeatmap({ colors, scale = 1 }) {
  // Eğer colors prop'u gelmezse veya yükleniyorsa varsayılan gri tonu kullan
  const defaultColor = "#334155"; // slate-700
  
  const c = {
    chest: colors?.chest || defaultColor,
    shoulders: colors?.shoulders || defaultColor,
    arms: colors?.arms || defaultColor,
    abs: colors?.abs || defaultColor,
    legs: colors?.legs || defaultColor,
    back: colors?.back || defaultColor,
  };

  // Ortak stil (hover efekti ve geçişler)
  const pathStyle = "transition-all duration-500 ease-in-out hover:opacity-80 cursor-pointer";
  const strokeColor = "#020617"; // slate-950 (Arka plan rengiyle aynı olsun ki parçalar ayrı dursun)
  const strokeWidth = "1.5";

  return (
    <div 
      className="flex justify-center items-center gap-6 select-none" 
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      
      {/* ============================== */}
      {/* ÖN TARA (ANTERIOR)      */}
      {/* ============================== */}
      <div className="relative flex flex-col items-center">
        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-2">ÖN</span>
        <svg width="110" height="240" viewBox="0 0 110 240" className="drop-shadow-2xl">
          
          {/* KAFA (Nötr) */}
          <path d="M45,10 Q55,0 65,10 L62,25 L48,25 Z" fill="#475569" stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* BOYUN (Nötr) */}
          <path d="M48,25 L62,25 L65,30 L45,30 Z" fill="#475569" stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* OMUZLAR (Shoulders - Ön) */}
          <path id="shoulder-L" d="M45,30 L25,35 L20,55 L40,45 Z" fill={c.shoulders} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path id="shoulder-R" d="M65,30 L85,35 L90,55 L70,45 Z" fill={c.shoulders} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* GÖĞÜS (Chest) */}
          <path id="chest-L" d="M45,30 L55,30 L55,65 L40,60 L40,45 Z" fill={c.chest} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path id="chest-R" d="M55,30 L65,30 L70,45 L70,60 L55,65 Z" fill={c.chest} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* KOLLAR (Arms - Biceps/Forearms) */}
          {/* Sol Kol */}
          <path id="arm-L-upper" d="M20,55 L25,55 L28,80 L18,80 Z" fill={c.arms} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path id="arm-L-lower" d="M18,80 L28,80 L30,110 L15,110 Z" fill={c.arms} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Sağ Kol */}
          <path id="arm-R-upper" d="M90,55 L85,55 L82,80 L92,80 Z" fill={c.arms} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path id="arm-R-lower" d="M92,80 L82,80 L80,110 L95,110 Z" fill={c.arms} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* KARIN (Abs) */}
          {/* Üst Karın */}
          <path d="M40,60 L55,65 L70,60 L68,85 L42,85 Z" fill={c.abs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Alt Karın / Obliques */}
          <path d="M42,85 L68,85 L65,100 L45,100 Z" fill={c.abs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* KASIK (Nötr) */}
          <path d="M45,100 L65,100 L55,115 Z" fill="#475569" stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* BACAKLAR (Legs - Quads) */}
          {/* Sol Üst */}
          <path id="leg-L-upper" d="M45,100 L55,115 L52,150 L35,145 L30,110 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Sağ Üst */}
          <path id="leg-R-upper" d="M65,100 L55,115 L58,150 L75,145 L80,110 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          
          {/* BACAKLAR (Legs - Calves) */}
          {/* Sol Alt */}
          <path id="leg-L-lower" d="M35,145 L52,150 L50,190 L38,190 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Sağ Alt */}
          <path id="leg-R-lower" d="M75,145 L58,150 L60,190 L72,190 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

        </svg>
      </div>

      {/* ============================== */}
      {/* ARKA TARA (POSTERIOR)   */}
      {/* ============================== */}
      <div className="relative flex flex-col items-center">
        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-2">ARKA</span>
        <svg width="110" height="240" viewBox="0 0 110 240" className="drop-shadow-2xl">
          
          {/* KAFA (Nötr) */}
          <path d="M45,10 Q55,0 65,10 L62,25 L48,25 Z" fill="#475569" stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* OMUZLAR (Shoulders - Arka/Traps) */}
          <path d="M48,25 L62,25 L85,35 L90,45 L65,55 L45,55 L20,45 L25,35 Z" fill={c.shoulders} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* SIRT (Back - Lats) */}
          {/* Sol Lat */}
          <path d="M45,55 L25,60 L35,90 L55,95 Z" fill={c.back} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Sağ Lat */}
          <path d="M65,55 L85,60 L75,90 L55,95 Z" fill={c.back} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Orta Omurga Hattı (Dekoratif) */}
          <path d="M55,55 L55,95" stroke={strokeColor} strokeWidth="2" />

          {/* BEL (Back - Lower) */}
          <path d="M35,90 L75,90 L65,105 L45,105 Z" fill={c.back} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* KOLLAR ARKA (Arms - Triceps) */}
          <path d="M20,45 L25,60 L28,80 L18,80 Z" fill={c.arms} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M18,80 L28,80 L30,110 L15,110 Z" fill={c.arms} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          
          <path d="M90,45 L85,60 L82,80 L92,80 Z" fill={c.arms} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M92,80 L82,80 L80,110 L95,110 Z" fill={c.arms} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* KALÇA (Legs - Glutes) - Teknik olarak Leg antrenmanına dahil */}
          <path d="M45,105 L65,105 L75,130 L55,135 L35,130 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* BACAKLAR ARKA (Legs - Hamstrings) */}
          <path d="M35,130 L55,135 L52,160 L38,160 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M75,130 L55,135 L58,160 L72,160 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* BALDIRLAR (Legs - Calves) */}
          <path d="M38,160 L52,160 L50,190 L40,190 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M72,160 L58,160 L60,190 L70,190 Z" fill={c.legs} className={pathStyle} stroke={strokeColor} strokeWidth={strokeWidth} />

        </svg>
      </div>
    </div>
  );
}