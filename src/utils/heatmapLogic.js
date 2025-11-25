// --- 1. SABİTLER: HAREKET & KAS EŞLEŞTİRMESİ ---
export const EXERCISE_DB = {
  // GÖĞÜS (Chest)
  "Bench Press": "chest",
  "Incline Dumbbell Press": "chest",
  "Cable Fly": "chest",
  "Push Up": "chest",
  "Dumbbell Press": "chest",
  
  // SIRT (Back)
  "Deadlift": "back",
  "Barbell Row": "back",
  "Lat Pulldown": "back",
  "Pull Up": "back",
  "Seated Cable Row": "back",
  
  // BACAK (Legs - Quads/Hamstrings/Calves birleşik basit model)
  "Squat": "legs",
  "Leg Press": "legs",
  "Leg Extension": "legs",
  "Lunge": "legs",
  "Calf Raise": "legs",
  "Romanian Deadlift": "legs",
  
  // OMUZ (Shoulders)
  "Overhead Press": "shoulders",
  "Lateral Raise": "shoulders",
  "Face Pull": "shoulders",
  "Military Press": "shoulders",
  
  // KOL (Arms - Biceps/Triceps)
  "Bicep Curl": "arms",
  "Hammer Curl": "arms",
  "Tricep Pushdown": "arms",
  "Skullcrusher": "arms",
  "Dips": "arms",

  // KARIN (Abs)
  "Crunch": "abs",
  "Leg Raise": "abs",
  "Plank": "abs"
};

// --- 2. RENK SKALASI (5 Renk) ---
export const HEATMAP_COLORS = {
  highPositive: "#22c55e", // Koyu Yeşil (%5+ artış)
  lowPositive: "#86efac",  // Açık Yeşil (%0 - %5 artış)
  neutral: "#facc15",      // Sarı (Değişim yok)
  lowNegative: "#fb923c",  // Turuncu (Ufak düşüş)
  highNegative: "#ef4444", // Kırmızı (Ciddi düşüş)
  empty: "#1e293b"         // Gri (Veri yok)
};

// --- 3. HESAPLAMA MOTORU ---
export const calculateMuscleHeatmap = (history) => {
  if (!history || history.length === 0) return {};

  const now = new Date();
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(now.getDate() - 21);

  // A. Son 21 günün verilerini filtrele ve düzleştir
  const recentWorkouts = history.filter(h => new Date(h.date) >= threeWeeksAgo);
  
  // Hareket bazında grupla: { "Bench Press": [ {date, 1rm}, {date, 1rm} ] }
  const exerciseStats = {};

  recentWorkouts.forEach(day => {
    day.exercises.forEach(ex => {
      // Sadece veritabanımızda tanıdığımız hareketleri al
      if (EXERCISE_DB[ex.name]) {
        if (!exerciseStats[ex.name]) exerciseStats[ex.name] = [];
        
        // O günkü Max 1RM'yi bul
        const max1RM = Math.max(...ex.sets.map(s => Number(s.weight) * (1 + Number(s.reps) / 30)));
        
        exerciseStats[ex.name].push({
          date: new Date(day.date),
          value: max1RM
        });
      }
    });
  });

  // B. Her hareketin gelişim yüzdesini hesapla
  const muscleTrends = {}; // { chest: [5.2, 0, 1.1], legs: [-2] }

  Object.keys(exerciseStats).forEach(exName => {
    const dataPoints = exerciseStats[exName].sort((a, b) => a.date - b.date);
    
    // En az 2 veri noktası lazım ki "Değişim" hesaplayalım
    if (dataPoints.length >= 2) {
      const start = dataPoints[0].value;
      const end = dataPoints[dataPoints.length - 1].value;
      
      if (start > 0) {
        const percentChange = ((end - start) / start) * 100;
        const muscleGroup = EXERCISE_DB[exName];
        
        if (!muscleTrends[muscleGroup]) muscleTrends[muscleGroup] = [];
        muscleTrends[muscleGroup].push(percentChange);
      }
    }
  });

  // C. Kas gruplarının ortalamasını al ve renge çevir
  const finalColors = {};
  
  // Varsayılan olarak her yeri gri yap
  ["chest", "back", "legs", "shoulders", "arms", "abs"].forEach(m => finalColors[m] = HEATMAP_COLORS.empty);

  Object.keys(muscleTrends).forEach(muscle => {
    const changes = muscleTrends[muscle];
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;

    if (avgChange >= 5) finalColors[muscle] = HEATMAP_COLORS.highPositive;
    else if (avgChange > 0) finalColors[muscle] = HEATMAP_COLORS.lowPositive;
    else if (avgChange === 0) finalColors[muscle] = HEATMAP_COLORS.neutral;
    else if (avgChange > -5) finalColors[muscle] = HEATMAP_COLORS.lowNegative;
    else finalColors[muscle] = HEATMAP_COLORS.highNegative;
  });

  return { colors: finalColors, trends: muscleTrends };
};