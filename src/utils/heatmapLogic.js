// --- 1. SABİTLER: HAREKET & KAS EŞLEŞTİRMESİ ---
export const EXERCISE_DB = {
  // --- GÖĞÜS (Chest - Ön) ---
  "Bench Press": "chest",
  "Incline Dumbbell Press": "chest",
  "Cable Fly": "chest",
  "Dumbbell Press": "chest",
  "Push Up": "chest",
  "Chest Dip": "chest",

  // --- SIRT (Lats/Back - Arka) ---
  "Pull Up": "lats",
  "Lat Pulldown": "lats",
  "Barbell Row": "lats",
  "Seated Cable Row": "lats",
  "Deadlift": "lats", 
  "T-Bar Row": "lats",
  
  // --- OMUZ (Shoulders - Ön/Arka) ---
  "Overhead Press": "shoulders",
  "Military Press": "shoulders",
  "Lateral Raise": "shoulders",
  "Face Pull": "shoulders",
  "Front Raise": "shoulders",
  "Arnold Press": "shoulders",

  // --- TRAPEZ (Traps - Ön/Arka) ---
  "Shrugs": "traps",
  "Upright Row": "traps",

  // --- ARKA KOL (Triceps - Arka) ---
  "Tricep Pushdown": "triceps",
  "Skullcrusher": "triceps",
  "Close Grip Bench Press": "triceps",
  "Dips": "triceps",
  "Tricep Extension": "triceps",

  // --- PAZU (Biceps - Ön) - YENİ EKLENDİ ---
  "Bicep Curl": "biceps",
  "Barbell Curl": "biceps",
  "Preacher Curl": "biceps",
  "Concentration Curl": "biceps",

  // --- ÖN KOL (Forearms - Ön) ---
  "Hammer Curl": "forearms", 
  "Reverse Curl": "forearms",
  "Wrist Curl": "forearms",
  "Farmer Walk": "forearms",

  // --- KARIN (Abs - Ön) ---
  "Crunch": "abs",
  "Leg Raise": "abs",
  "Plank": "abs",
  "Cable Crunch": "abs",
  "Russian Twist": "abs",

  // --- GLUTES (Kalça - Arka) ---
  "Hip Thrust": "glutes",
  "Glute Bridge": "glutes",
  "Cable Kickback": "glutes",

  // --- QUADS (Ön Bacak - Ön) ---
  "Squat": "quads",
  "Leg Press": "quads",
  "Leg Extension": "quads",
  "Lunge": "quads",
  "Goblet Squat": "quads",
  "Bulgarian Split Squat": "quads",

  // --- HAMSTRINGS (Arka Bacak - Arka) ---
  "Romanian Deadlift": "hamstrings",
  "Leg Curl": "hamstrings",
  "Good Morning": "hamstrings",

  // --- KALF (Calves - Arka) ---
  "Calf Raise": "calves",
  "Seated Calf Raise": "calves"
};

// --- 2. RENK SKALASI ---
export const HEATMAP_COLORS = {
  highPositive: "#22c55e", // Koyu Yeşil
  lowPositive: "#86efac",  // Açık Yeşil
  neutral: "#facc15",      // Sarı
  lowNegative: "#fb923c",  // Turuncu
  highNegative: "#ef4444", // Kırmızı
  empty: "#334155"         // Gri (Daha belirgin bir gri seçtim)
};

// --- 3. HESAPLAMA MOTORU ---
export const calculateMuscleHeatmap = (history) => {
  if (!history || history.length === 0) return {};

  const now = new Date();
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(now.getDate() - 21);

  const recentWorkouts = history.filter(h => new Date(h.date) >= threeWeeksAgo);
  const exerciseStats = {};

  recentWorkouts.forEach(day => {
    day.exercises.forEach(ex => {
      if (EXERCISE_DB[ex.name]) {
        if (!exerciseStats[ex.name]) exerciseStats[ex.name] = [];
        const max1RM = Math.max(...ex.sets.map(s => Number(s.weight) * (1 + Number(s.reps) / 30)));
        exerciseStats[ex.name].push({ date: new Date(day.date), value: max1RM });
      }
    });
  });

  const muscleTrends = {}; 

  Object.keys(exerciseStats).forEach(exName => {
    const dataPoints = exerciseStats[exName].sort((a, b) => a.date - b.date);
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

  const finalColors = {};
  // Biceps Eklendi
  const allMuscles = ["chest", "lats", "shoulders", "traps", "triceps", "biceps", "forearms", "abs", "glutes", "quads", "hamstrings", "calves"];
  
  allMuscles.forEach(m => finalColors[m] = HEATMAP_COLORS.empty);

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