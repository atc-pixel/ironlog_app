import React, { createContext, useState, useEffect, useContext } from "react";

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ironlog_history")) || []; } catch (e) { return []; }
  });
  const [customExercises, setCustomExercises] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ironlog_exercises")) || []; } catch (e) { return []; }
  });
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ironlog_settings")) || { restTimerEnabled: true, restTimerSeconds: 90 }; } catch (e) { return { restTimerEnabled: true, restTimerSeconds: 90 }; }
  });

  useEffect(() => { localStorage.setItem("ironlog_history", JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem("ironlog_exercises", JSON.stringify(customExercises)); }, [customExercises]);
  useEffect(() => { localStorage.setItem("ironlog_settings", JSON.stringify(settings)); }, [settings]);

  const saveWorkout = (workoutData) => {
    setHistory((prev) => {
      const existingIndex = prev.findIndex(item => item.date === workoutData.date);
      if (existingIndex !== -1) {
        const updatedHistory = [...prev];
        updatedHistory[existingIndex] = { ...updatedHistory[existingIndex], exercises: workoutData.exercises, lastUpdated: Date.now() };
        return updatedHistory;
      } else {
        return [workoutData, ...prev];
      }
    });
  };

  const addCustomExercise = (name) => {
    if (!customExercises.some(ex => ex.toLowerCase() === name.toLowerCase())) {
      setCustomExercises(prev => [...prev, name]);
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("ironlog_history");
  };

  return (
    <WorkoutContext.Provider value={{ history, saveWorkout, clearHistory, customExercises, addCustomExercise, settings, updateSettings }}>
      {children}
    </WorkoutContext.Provider>
  );
};