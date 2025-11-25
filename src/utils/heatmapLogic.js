// --- 1. SABİTLER: HAREKET & KAS EŞLEŞTİRMESİ ---
export const EXERCISE_DB = {
  // GÖĞÜS (Chest)
  "Bench Press": "chest",
  "Incline Dumbbell Press": "chest",
  "Cable Fly": "chest",
  "Push Up": "chest",
  "Dumbbell Press": "chest",
  "Chest Press": "chest",
  "Pec Deck": "chest",
  
  // SIRT (Back)
  "Deadlift": "back",
  "Barbell Row": "back",
  "Lat Pulldown": "back",
  "Pull Up": "back",
  "Seated Cable Row": "back",
  "T-Bar Row": "back",
  "Face Pull": "back", // Omuz/Sırt hibrit, sırta aldık
  
  // BACAK (Legs) - YENİ EKLENENLER
  "Squat": "legs",
  "Squad": "legs", // Yazım hatası toleransı
  "Barbell Squat": "legs",
  "Leg Press": "legs",
  "Leg Extension": "legs",
  "Lunge": "legs",
  "Lunges": "legs",
  "Calf Raise": "legs",
  "Romanian Deadlift": "legs",
  "RDL": "legs",
  "Leg Curl": "legs",
  "Goblet Squat": "legs",
  "Bulgarian Split Squat": "legs",
  
  // OMUZ (Shoulders)
  "Overhead Press": "shoulders",
  "OHP": "shoulders",
  "Lateral Raise": "shoulders",
  "Military Press": "shoulders",
  "Arnold Press": "shoulders",
  "Front Raise": "shoulders",
  
  // KOL (Arms)
  "Bicep Curl": "arms",
  "Hammer Curl": "arms",
  "Tricep Pushdown": "arms",
  "Triceps Pushdown": "arms",
  "Skullcrusher": "arms",
  "Dips": "arms",
  "Preacher Curl": "arms",

  // KARIN (Abs)
  "Crunch": "abs",
  "Leg Raise": "abs",
  "Plank": "abs",
  "Russian Twist": "abs",
  "Hanging Leg Raise": "abs"
};

// --- 2. RENK SKALASI ---
export const HEATMAP_COLORS = {
  empty: "#1e293b",        // Veri yok (Koyu Gri)
  highNegative: "#ef4444", // Kırmızı
  lowNegative: "#fb923c",  // Turuncu
  neutral: "#facc15",      // Sarı
  lowPositive: "#86efac",  // Açık Yeşil
  highPositive: "#22c55e"  // Koyu Yeşil
};

// --- 3. HESAPLAMA MOTORU ---
export const calculateMuscleHeatmap = (history) => {
  if (!history || history.length === 0) return {};

  const now = new Date();
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(now.getDate() - 21);

  // Tarih filtresi ve güvenli tarih dönüştürme
  const recentWorkouts = history.filter(h => {
    const d = new Date(h.date);
    return !isNaN(d) && d >= threeWeeksAgo;
  });
  
  const exerciseStats = {};

  recentWorkouts.forEach(day => {
    day.exercises.forEach(ex => {
      // Büyük/küçük harf duyarlılığını kaldırmak için trim()
      const exName = ex.name.trim();
      
      // Veritabanında var mı kontrol et
      if (EXERCISE_DB[exName]) {
        if (!exerciseStats[exName]) exerciseStats[exName] = [];
        
        // 1RM Hesabı
        const max1RM = Math.max(...ex.sets.map(s => Number(s.weight) * (1 + Number(s.reps) / 30)));
        
        // Eğer geçerli bir sayı ise ekle
        if (!isNaN(max1RM) && max1RM > 0) {
          exerciseStats[exName].push({
            date: new Date(day.date),
            value: max1RM
          });
        }
      }
    });
  });

  const muscleTrends = {}; 

  Object.keys(exerciseStats).forEach(exName => {
    const dataPoints = exerciseStats[exName].sort((a, b) => a.date - b.date);
    const muscleGroup = EXERCISE_DB[exName];

    if (!muscleTrends[muscleGroup]) muscleTrends[muscleGroup] = [];

    if (dataPoints.length >= 2) {
      const start = dataPoints[0].value;
      const end = dataPoints[dataPoints.length - 1].value;
      
      if (start > 0) {
        const percentChange = ((end - start) / start) * 100;
        muscleTrends[muscleGroup].push(percentChange);
      }
    } else if (dataPoints.length === 1) {
      // Tek veri varsa bile aktif (0 değişim = Sarı)
      muscleTrends[muscleGroup].push(0);
    }
  });

  const finalColors = {};
  ["chest", "back", "legs", "shoulders", "arms", "abs"].forEach(m => finalColors[m] = HEATMAP_COLORS.empty);

  Object.keys(muscleTrends).forEach(muscle => {
    const changes = muscleTrends[muscle];
    if (changes.length > 0) {
      const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;

      if (avgChange >= 5) finalColors[muscle] = HEATMAP_COLORS.highPositive;
      else if (avgChange > 0) finalColors[muscle] = HEATMAP_COLORS.lowPositive;
      else if (avgChange === 0) finalColors[muscle] = HEATMAP_COLORS.neutral;
      else if (avgChange > -5) finalColors[muscle] = HEATMAP_COLORS.lowNegative;
      else finalColors[muscle] = HEATMAP_COLORS.highNegative;
    }
  });

  return { colors: finalColors, trends: muscleTrends };
};