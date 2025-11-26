// --- 1. SABİTLER: HAREKET & KAS GRUPLARI (12 PARÇALI YAPI) ---
export const EXERCISE_DB = {
  // 1. GÖĞÜS (Chest)
  "Bench Press": "chest",
  "Incline Dumbbell Press": "chest",
  "Cable Fly": "chest",
  "Push Up": "chest",
  "Dumbbell Press": "chest",
  "Chest Press": "chest",
  "Pec Deck": "chest",
  
  // 2. SIRT (Back - Kanat & Bel)
  "Barbell Row": "back",
  "Lat Pulldown": "back",
  "Pull Up": "back",
  "Seated Cable Row": "back",
  "T-Bar Row": "back",
  "Deadlift": "back", // Hem sırt hem bacak ama genelde sırta yazılır
  "Rack Pull": "back",
  
  // 3. TRAPEZ (Trapezius)
  "Shrugs": "trapezius",
  "Dumbbell Shrug": "trapezius",
  "Upright Row": "trapezius", // Omuz/Trapez hibrit

  // 4. OMUZ (Shoulders - Ön/Yan/Arka)
  "Overhead Press": "shoulders",
  "OHP": "shoulders",
  "Lateral Raise": "shoulders",
  "Military Press": "shoulders",
  "Arnold Press": "shoulders",
  "Front Raise": "shoulders",
  "Face Pull": "shoulders",
  "Rear Delt Fly": "shoulders",
  
  // 5. PAZU (Biceps)
  "Bicep Curl": "biceps",
  "Hammer Curl": "biceps",
  "Preacher Curl": "biceps",
  "Concentration Curl": "biceps",
  "Barbell Curl": "biceps",

  // 6. ARKA KOL (Triceps)
  "Tricep Pushdown": "triceps",
  "Triceps Pushdown": "triceps", // Yazım toleransı
  "Skullcrusher": "triceps",
  "Dips": "triceps",
  "Tricep Extension": "triceps",
  "Close Grip Bench Press": "triceps",

  // 7. ÖN KOL (Forearms)
  "Wrist Curl": "forearms",
  "Reverse Curl": "forearms",
  "Farmers Walk": "forearms",

  // 8. KARIN (Abs)
  "Crunch": "abs",
  "Leg Raise": "abs",
  "Plank": "abs",
  "Russian Twist": "abs",
  "Hanging Leg Raise": "abs",
  "Sit Up": "abs",

  // 9. ÜST BACAK (Legs - Quads/Hams/Glutes/Adductors)
  "Squat": "legs",
  "Squad": "legs", // Eski veriler için tolerans
  "Barbell Squat": "legs",
  "Leg Press": "legs",
  "Leg Extension": "legs",
  "Lunge": "legs",
  "Lunges": "legs",
  "Romanian Deadlift": "legs", // RDL arka bacak odaklıdır
  "RDL": "legs",
  "Leg Curl": "legs",
  "Goblet Squat": "legs",
  "Bulgarian Split Squat": "legs",
  "Hip Thrust": "legs", // Glute odaklı
  
  // 10. BALDIR (Calves)
  "Calf Raise": "calves",
  "Seated Calf Raise": "calves",
  
  // 11. DİĞERLERİ (Tibialis, Neck vb. - Şimdilik boş)
};

// --- 2. RENK SKALASI ---
export const HEATMAP_COLORS = {
  empty: "#1e293b",        // Veri yok (Koyu Gri - Slate 800)
  highNegative: "#ef4444", // Kırmızı
  lowNegative: "#fb923c",  // Turuncu
  neutral: "#facc15",      // Sarı (Yeni/Sabit)
  lowPositive: "#86efac",  // Açık Yeşil
  highPositive: "#22c55e"  // Koyu Yeşil
};

// --- 3. HESAPLAMA MOTORU ---
export const calculateMuscleHeatmap = (history) => {
  if (!history || history.length === 0) return {};

  const now = new Date();
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(now.getDate() - 21);

  const recentWorkouts = history.filter(h => {
    const d = new Date(h.date);
    return !isNaN(d) && d >= threeWeeksAgo;
  });
  
  const exerciseStats = {};

  recentWorkouts.forEach(day => {
    day.exercises.forEach(ex => {
      const exName = ex.name.trim();
      
      if (EXERCISE_DB[exName]) {
        if (!exerciseStats[exName]) exerciseStats[exName] = [];
        
        // 1RM Hesabı (Epley)
        const max1RM = Math.max(...ex.sets.map(s => Number(s.weight) * (1 + Number(s.reps) / 30)));
        
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
      muscleTrends[muscleGroup].push(0); // Tek antrenman = Sarı (Aktif)
    }
  });

  // Tüm grupları varsayılan renkle başlat
  const finalColors = {};
  const allGroups = [
    "chest", "back", "trapezius", "shoulders", 
    "biceps", "triceps", "forearms", "abs", 
    "legs", "calves", "tibialis", "neck"
  ];
  
  allGroups.forEach(m => finalColors[m] = HEATMAP_COLORS.empty);

  // Hesaplanan değerleri renge çevir
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