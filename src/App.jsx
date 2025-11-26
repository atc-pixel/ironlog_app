import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { WorkoutProvider } from "./context/WorkoutContext"; 
import HomePage from "./pages/HomePage";
import WorkoutPage from "./pages/WorkoutPage";
import AnalysisPage from "./pages/AnalysisPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage"; // YENİ

const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Yükleniyor...</p>
  </div>
);

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('home'); 
  const [selectedDate, setSelectedDate] = useState(null);

  const startWorkout = (date) => { setSelectedDate(date); setCurrentScreen('workout'); };
  const finishWorkout = () => { setCurrentScreen('home'); };
  const openAnalysis = () => { setCurrentScreen('analysis'); };
  const openSettings = () => { setCurrentScreen('settings'); };
  const openHistory = () => { setCurrentScreen('history'); }; // YENİ
  const goHome = () => { setCurrentScreen('home'); };

  return (
    <>
       {currentScreen === 'home' && (
         <HomePage 
           onStartWorkout={startWorkout} 
           onOpenAnalysis={openAnalysis} 
           onOpenSettings={openSettings}
           onOpenHistory={openHistory} // YENİ
         />
       )}
       {currentScreen === 'workout' && <WorkoutPage onFinishAndExit={finishWorkout} initialDate={selectedDate} />}
       {currentScreen === 'analysis' && <AnalysisPage onBack={goHome} />}
       {currentScreen === 'settings' && <SettingsPage onBack={goHome} />}
       {currentScreen === 'history' && <HistoryPage onBack={goHome} />} {/* YENİ */}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginPage />;

  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}