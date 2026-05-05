"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (username === "admin_holicindo" && password === "adminpassword") {
      document.cookie = "user_id=admin; path=/; max-age=86400; SameSite=Lax";
      // Gunakan push saja, refresh tidak perlu dipanggil manual di sini
      router.push("/gateway");
    } else if (username === "manager_coffee" && password === "password123") {
      document.cookie = "user_id=u1; path=/; max-age=86400; SameSite=Lax";
      router.push("/");
    } else if (username === "manager_chocolate" && password === "password123") {
      document.cookie = "user_id=u2; path=/; max-age=86400; SameSite=Lax";
      router.push("/");
    } else {
      setError("Username atau password salah");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100">
        <div className="text-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 block mb-2">
            Internal Portal
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            PT. Holicindo
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Masuk untuk mengelola Digital Twin
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="group">
            <input
              type="text"
              placeholder="Username"
              autoComplete="username"
              className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="group">
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
              <p className="text-red-600 text-[10px] font-bold uppercase text-center tracking-widest">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-blue-200 active:scale-[0.98] transition-all mt-4 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Memproses..." : "Masuk Ke System"}
          </button>
        </form>

        <p className="text-center mt-10 text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">
          Hanya untuk personil berwenang
        </p>
      </div>
    </main>
  );
}
