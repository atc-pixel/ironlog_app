import React, { useState } from "react";
import { WorkoutProvider } from "./context/WorkoutContext"; 
import HomePage from "./pages/HomePage";
import WorkoutPage from "./pages/WorkoutPage";
import AnalysisPage from "./pages/AnalysisPage";
import SettingsPage from "./pages/SettingsPage";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('home'); 
  const [selectedDate, setSelectedDate] = useState(null);

  const startWorkout = (date) => { setSelectedDate(date); setCurrentScreen('workout'); };
  const finishWorkout = () => { setCurrentScreen('home'); };
  const openAnalysis = () => { setCurrentScreen('analysis'); };
  const openSettings = () => { setCurrentScreen('settings'); };
  const goHome = () => { setCurrentScreen('home'); };

  return (
    <>
       {currentScreen === 'home' && <HomePage onStartWorkout={startWorkout} onOpenAnalysis={openAnalysis} onOpenSettings={openSettings} />}
       {currentScreen === 'workout' && <WorkoutPage onFinishAndExit={finishWorkout} initialDate={selectedDate} />}
       {currentScreen === 'analysis' && <AnalysisPage onBack={goHome} />}
       {currentScreen === 'settings' && <SettingsPage onBack={goHome} />}
    </>
  );
}

export default function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}