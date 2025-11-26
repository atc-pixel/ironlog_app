// src/utils/demoData.js

export const getDemoData = () => {
  const today = new Date();
  
  // Yardımcı: Bugünün tarihinden n gün geriye git
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(today.getDate() - n);
    return d.toISOString().split('T')[0];
  };

  // 4 Haftalık Örnek Program (Progressive Overload Senaryosu)
  return [
    // --- 4 HAFTA ÖNCE (Başlangıç) ---
    {
      id: 1700000000001, date: daysAgo(28), exercises: [
        { id: 101, name: "Squat", sets: [{ weight: 60, reps: 10 }, { weight: 60, reps: 10 }] }, // Legs
        { id: 102, name: "Bench Press", sets: [{ weight: 50, reps: 10 }, { weight: 50, reps: 10 }] }, // Chest
        { id: 103, name: "Barbell Row", sets: [{ weight: 40, reps: 12 }] } // Back
      ]
    },
    {
      id: 1700000000002, date: daysAgo(26), exercises: [
        { id: 201, name: "Overhead Press", sets: [{ weight: 30, reps: 10 }] }, // Shoulders
        { id: 202, name: "Bicep Curl", sets: [{ weight: 10, reps: 12 }] }, // Biceps
        { id: 203, name: "Tricep Pushdown", sets: [{ weight: 15, reps: 15 }] } // Triceps
      ]
    },

    // --- 3 HAFTA ÖNCE (Hafif Artış) ---
    {
      id: 1700000000003, date: daysAgo(21), exercises: [
        { id: 301, name: "Squat", sets: [{ weight: 65, reps: 10 }, { weight: 65, reps: 8 }] }, // Legs (Arttı)
        { id: 302, name: "Leg Extension", sets: [{ weight: 40, reps: 15 }] }, // Legs
        { id: 303, name: "Calf Raise", sets: [{ weight: 40, reps: 20 }] } // Calves
      ]
    },
    {
      id: 1700000000004, date: daysAgo(19), exercises: [
        { id: 401, name: "Bench Press", sets: [{ weight: 52.5, reps: 10 }] }, // Chest (Arttı)
        { id: 402, name: "Pull Up", sets: [{ weight: 0, reps: 5 }] }, // Back
        { id: 403, name: "Crunch", sets: [{ weight: 0, reps: 20 }] } // Abs
      ]
    },

    // --- 2 HAFTA ÖNCE (Sabit / Karışık) ---
    {
      id: 1700000000005, date: daysAgo(14), exercises: [
        { id: 501, name: "Squat", sets: [{ weight: 65, reps: 10 }] }, // Legs (Sabit)
        { id: 502, name: "Romanian Deadlift", sets: [{ weight: 70, reps: 10 }] } // Legs/Hamstrings
      ]
    },
    {
      id: 1700000000006, date: daysAgo(12), exercises: [
        { id: 601, name: "Lateral Raise", sets: [{ weight: 8, reps: 15 }] }, // Shoulders
        { id: 602, name: "Face Pull", sets: [{ weight: 15, reps: 15 }] }, // Shoulders
        { id: 603, name: "Hammer Curl", sets: [{ weight: 12, reps: 10 }] } // Biceps (Arttı)
      ]
    },

    // --- GEÇEN HAFTA (Yüksek Performans) ---
    {
      id: 1700000000007, date: daysAgo(7), exercises: [
        { id: 701, name: "Squat", sets: [{ weight: 70, reps: 8 }] }, // Legs (Rekor)
        { id: 702, name: "Leg Press", sets: [{ weight: 120, reps: 12 }] }, // Legs
        { id: 703, name: "Calf Raise", sets: [{ weight: 50, reps: 15 }] } // Calves (Arttı)
      ]
    },
    {
      id: 1700000000008, date: daysAgo(5), exercises: [
        { id: 801, name: "Bench Press", sets: [{ weight: 60, reps: 6 }] }, // Chest
        { id: 802, name: "Dips", sets: [{ weight: 0, reps: 10 }] }, // Triceps
        { id: 803, name: "Shrugs", sets: [{ weight: 20, reps: 15 }] } // Trapezius (Yeni)
      ]
    },
    
    // --- BUGÜN (Düşük Performans / Deload) ---
    {
      id: 1700000000009, date: daysAgo(0), exercises: [
        { id: 901, name: "Squat", sets: [{ weight: 50, reps: 10 }] }, // Legs (Düştü)
        { id: 902, name: "Wrist Curl", sets: [{ weight: 10, reps: 15 }] } // Forearms (Yeni)
      ]
    }
  ];
};