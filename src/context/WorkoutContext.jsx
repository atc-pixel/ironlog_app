import React, { createContext, useState, useEffect, useContext } from "react";
// Firebase kütüphanelerini ekliyoruz
import { db, auth } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Başlangıç değerleri boş, veritabanından dolacak
  const [history, setHistory] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [settings, setSettings] = useState({ restTimerEnabled: true, restTimerSeconds: 90 });
  
  // Veri yükleniyor mu? (Kullanıcıya boş ekran göstermemek için)
  const [loadingData, setLoadingData] = useState(true);

  // 1. KULLANICIYI TAKİP ET
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Kullanıcı çıkış yaparsa verileri temizle
      if (!currentUser) {
        setHistory([]);
        setCustomExercises([]);
        setLoadingData(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. VERİTABANINI DİNLE (Canlı Bağlantı)
  useEffect(() => {
    if (!user) return;

    // 'users' koleksiyonunda, kullanıcının ID'si ile bir döküman oluştur/dinle
    const userDocRef = doc(db, "users", user.uid);

    // onSnapshot: Veritabanında bir şey değişirse ANINDA buraya haber verir
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Verileri state'e doldur
        if (data.history) setHistory(data.history);
        if (data.customExercises) setCustomExercises(data.customExercises);
        if (data.settings) setSettings(data.settings);
      } else {
        // Yeni kullanıcıysa veritabanında boş bir kayıt oluştur
        setDoc(userDocRef, { history: [], customExercises: [], settings: { restTimerEnabled: true, restTimerSeconds: 90 } });
      }
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- VERİTABANINA KAYDETME FONKSİYONU ---
  // Tek bir fonksiyonla tüm veriyi güncelliyoruz
  const updateDatabase = async (newData) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    // merge: true -> Sadece değişen alanları güncelle, diğerlerini silme
    await setDoc(userDocRef, newData, { merge: true });
  };

  // --- FONKSİYONLAR ---

  const saveWorkout = (workoutData) => {
    // Önce yerel state'i güncelle (Hız için)
    // Sonra veritabanına gönder
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

    setHistory(updatedHistory); // Ekran hemen güncellensin
    updateDatabase({ history: updatedHistory }); // Buluta gönder
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
      loadingData 
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};