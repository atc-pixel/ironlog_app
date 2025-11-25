import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Activity } from "../components/Icons";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // true: Giriş, false: Kayıt
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Giriş Yap
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Kayıt Ol
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      // Basit hata mesajları (Türkçeleştirme)
      if (err.code === "auth/invalid-email") setError("Geçersiz e-posta adresi.");
      else if (err.code === "auth/user-not-found") setError("Kullanıcı bulunamadı.");
      else if (err.code === "auth/wrong-password") setError("Hatalı şifre.");
      else if (err.code === "auth/email-already-in-use") setError("Bu e-posta zaten kullanımda.");
      else if (err.code === "auth/weak-password") setError("Şifre en az 6 karakter olmalı.");
      else setError("Bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">
        
        {/* Logo Alanı */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl mb-4">
            <Activity size={40} className="text-blue-500" />
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">IRONLOG</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
            {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1.5">E-Posta</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white p-3.5 rounded-xl focus:border-blue-500 outline-none transition-colors"
                placeholder="ornek@mail.com"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1.5">Şifre</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white p-3.5 rounded-xl focus:border-blue-500 outline-none transition-colors"
                placeholder="••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin ? "Giriş Yap" : "Kayıt Ol"
            )}
          </button>

        </form>

        {/* Alt Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            {isLogin ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }} 
              className="text-blue-400 font-bold ml-2 hover:underline"
            >
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}