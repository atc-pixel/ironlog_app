import React from "react";

export default function BodyHeatmap({ colors, scale = 1 }) {
  // Varsayılan gri renk (Eğer colors prop'u gelmezse)
  const c = colors || {
    chest: "#1e293b",
    shoulders: "#1e293b",
    arms: "#1e293b",
    abs: "#1e293b",
    legs: "#1e293b",
    back: "#1e293b"
  };

  return (
    <div className="flex justify-center gap-8" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      
      {/* --- ÖN TARA (FRONT) --- */}
      <svg width="100" height="200" viewBox="0 0 100 200" className="drop-shadow-lg">
        {/* Kafa (Dekoratif) */}
        <circle cx="50" cy="15" r="8" fill="#334155" />
        
        {/* Omuzlar (Shoulders) */}
        <path d="M 25 30 Q 50 25 75 30 L 85 45 L 75 55 L 25 55 L 15 45 Z" fill={c.shoulders} stroke="#0f172a" strokeWidth="1" />
        
        {/* Göğüs (Chest) */}
        <path d="M 30 55 L 70 55 L 65 85 Q 50 90 35 85 Z" fill={c.chest} stroke="#0f172a" strokeWidth="1" />
        
        {/* Karın (Abs) */}
        <path d="M 35 85 Q 50 90 65 85 L 60 110 L 40 110 Z" fill={c.abs} stroke="#0f172a" strokeWidth="1" />
        
        {/* Kollar (Arms) */}
        <path d="M 15 45 L 25 55 L 20 90 L 10 85 Z" fill={c.arms} stroke="#0f172a" strokeWidth="1" /> {/* Sol */}
        <path d="M 85 45 L 75 55 L 80 90 L 90 85 Z" fill={c.arms} stroke="#0f172a" strokeWidth="1" /> {/* Sağ */}
        
        {/* Bacaklar (Legs) - Ön */}
        <path d="M 40 110 L 60 110 L 70 150 L 60 190 L 40 190 L 30 150 Z" fill={c.legs} stroke="#0f172a" strokeWidth="1" />
      </svg>

      {/* --- ARKA TARAF (BACK) --- */}
      <svg width="100" height="200" viewBox="0 0 100 200" className="drop-shadow-lg">
        {/* Kafa */}
        <circle cx="50" cy="15" r="8" fill="#334155" />
        
        {/* Sırt Üst (Traps/Shoulders Back) */}
        <path d="M 25 30 Q 50 20 75 30 L 85 45 L 75 55 L 25 55 L 15 45 Z" fill={c.shoulders} stroke="#0f172a" strokeWidth="1" />
        
        {/* Sırt (Back / Lats) */}
        <path d="M 25 55 L 75 55 L 65 90 L 35 90 Z" fill={c.back} stroke="#0f172a" strokeWidth="1" />
        
        {/* Bel (Back - Lower) */}
        <path d="M 35 90 L 65 90 L 60 110 L 40 110 Z" fill={c.back} stroke="#0f172a" strokeWidth="1" />
        
        {/* Kollar Arka (Triceps) */}
        <path d="M 15 45 L 25 55 L 20 90 L 10 85 Z" fill={c.arms} stroke="#0f172a" strokeWidth="1" />
        <path d="M 85 45 L 75 55 L 80 90 L 90 85 Z" fill={c.arms} stroke="#0f172a" strokeWidth="1" />
        
        {/* Bacaklar Arka (Hamstrings) */}
        <path d="M 40 110 L 60 110 L 70 150 L 60 190 L 40 190 L 30 150 Z" fill={c.legs} stroke="#0f172a" strokeWidth="1" />
      </svg>

    </div>
  );
}