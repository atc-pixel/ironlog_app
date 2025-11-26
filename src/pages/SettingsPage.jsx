import React from "react";
import { useWorkout } from "../context/WorkoutContext";
import { auth } from "../firebase"; // Auth servisi
import { signOut } from "firebase/auth"; // Çıkış fonksiyonu
import { ArrowLeft, Clock, Settings, X, Save } from "../components/Icons"; // Save ikonunu ekledik

export default function SettingsPage({ onBack }) {
  const { settings, updateSettings, user, injectDemoData } = useWorkout();
  const timeOptions = [30, 60, 90, 120, 180];

  const handleLogout = async () => {
    if (window.confirm("Çıkış yapmak istediğine emin misin?")) {
      await signOut(auth);
      // App.jsx otomatik olarak Login sayfasına yönlendirecek
    }
  };

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col p-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-white italic tracking-tight flex items-center gap-2">
          <Settings size={24} className="text-blue-500" />
          AYARLAR
        </h1>
      </div>

      <div className="space-y-6">
        
        {/* Hesap Bilgisi */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-5 flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
             {user?.email?.charAt(0).toUpperCase()}
           </div>
           <div className="overflow-hidden">
             <div className="text-xs text-slate-500 font-bold uppercase">Giriş Yapılan Hesap</div>
             <div className="text-sm text-white truncate">{user?.email}</div>
           </div>
        </div>

        {/* Dinlenme Sayacı */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${settings.restTimerEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Dinlenme Sayacı</h3>
                <p className="text-xs text-slate-500">Set sonrası otomatik başlat</p>
              </div>
            </div>
            
            <button 
              onClick={() => updateSettings({ restTimerEnabled: !settings.restTimerEnabled })}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.restTimerEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.restTimerEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {settings.restTimerEnabled && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="h-px w-full bg-slate-800 mb-4"></div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Varsayılan Süre (Saniye)</label>
              
              <div className="grid grid-cols-5 gap-2">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => updateSettings({ restTimerSeconds: time })}
                    className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                      settings.restTimerSeconds === time 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/50' 
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- DEMO VERİSİ BUTONU --- */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5">
          <h3 className="font-bold text-lg text-white mb-2">Geliştirici Araçları</h3>
          <p className="text-xs text-slate-500 mb-4">Uygulamayı test etmek için örnek veri yükler.</p>
          <button 
            onClick={() => {
              if(window.confirm("Mevcut geçmiş silinecek ve demo verisi yüklenecek. Onaylıyor musun?")) {
                injectDemoData();
              }
            }}
            className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Save size={18} /> 1 Aylık Demo Verisi Yükle
          </button>
        </div>

        {/* Çıkış Yap Butonu */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          Çıkış Yap
        </button>

      </div>
    </div>
  );
}