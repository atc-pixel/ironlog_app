import React, { createContext, useState, useEffect, useContext } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getDemoData } from "../utils/demodata"; // <--- YENİ: Veriyi buradan çekiyoruz

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [settings, setSettings] = useState({ restTimerEnabled: true, restTimerSeconds: 90 });
  
  const [loadingData, setLoadingData] = useState(true);

  // ... (useEffect'ler ve updateDatabase aynı kalacak) ...
  
  // 1. KULLANICIYI TAKİP ET (AYNI)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setHistory([]);
        setCustomExercises([]);
        setLoadingData(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. VERİTABANINI DİNLE (AYNI)
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.history) setHistory(data.history);
        if (data.customExercises) setCustomExercises(data.customExercises);
        if (data.settings) setSettings(data.settings);
      } else {
        setDoc(userDocRef, { history: [], customExercises: [], settings: { restTimerEnabled: true, restTimerSeconds: 90 } });
      }
      setLoadingData(false);
    });
    return () => unsubscribe();
  }, [user]);

  // VERİTABANINA KAYDETME (AYNI)
  const updateDatabase = async (newData) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, newData, { merge: true });
  };

  // ... (saveWorkout, addCustomExercise, updateSettings, clearHistory AYNI) ...
  
  const saveWorkout = (workoutData) => {
    let updatedHistory = [...history];
    const existingIndex = history.findIndex(item => item.date === workoutData.date);
    if (existingIndex !== -1) {
      updatedHistory[existingIndex] = {
        ...updatedHistory[existingIndex],
        exercises: workoutData.exercises,
        lastUpdated: Date.now()
      };
    } else {
      updatedHistory = [workoutData, ...history];
    }
    setHistory(updatedHistory);
    updateDatabase({ history: updatedHistory });
  };

  const addCustomExercise = (name) => {
    if (!customExercises.some(ex => ex.toLowerCase() === name.toLowerCase())) {
      const updatedList = [...customExercises, name];
      setCustomExercises(updatedList);
      updateDatabase({ customExercises: updatedList });
    }
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    updateDatabase({ settings: updatedSettings });
  };

  const clearHistory = () => {
    setHistory([]);
    updateDatabase({ history: [] });
  };

  // --- YENİ: TEMİZ VE KISA DEMO FONKSİYONU ---
  const injectDemoData = async () => {
    if (!user) return;
    
    // Veriyi utils/demoData.js dosyasından alıyoruz
    const demoHistory = getDemoData(); 

    // Veritabanına basıyoruz
    await updateDatabase({ history: demoHistory });
    alert("Demo verileri başarıyla yüklendi! Analiz sayfasına bakabilirsin.");
  };

  return (
    <WorkoutContext.Provider value={{ 
      history, 
      saveWorkout, 
      clearHistory, 
      customExercises, 
      addCustomExercise, 
      settings, 
      updateSettings,
      user,
      loadingData,
      injectDemoData // <--- Bunu unutma
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};
