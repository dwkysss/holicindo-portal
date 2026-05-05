// app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (id: string) => {
    // Set cookie secara langsung
    document.cookie = `user_id=${id}; path=/; max-age=3600`; // Berlaku 1 jam

    // Paksa refresh dan ke dashboard
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full text-center">
        <div className="mb-8">
          <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
            Internal Portal
          </p>
          <h1 className="text-2xl font-black text-gray-900">PT. Holicindo</h1>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleLogin("u1")}
            className="w-full bg-white border-2 border-gray-100 hover:border-blue-500 p-4 rounded-2xl text-left transition-all group"
          >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">
              Klien A
            </p>
            <p className="font-bold text-gray-800">Global Coffee Chain</p>
          </button>

          <button
            onClick={() => handleLogin("u2")}
            className="w-full bg-white border-2 border-gray-100 hover:border-blue-500 p-4 rounded-2xl text-left transition-all group"
          >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">
              Klien B
            </p>
            <p className="font-bold text-gray-800">Luxury Chocolatier</p>
          </button>

          <button
            onClick={() => handleLogin("admin")}
            className="w-full bg-gray-900 hover:bg-gray-800 p-4 rounded-2xl text-left transition-all group text-white"
          >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Akses Staf
            </p>
            <p className="font-bold">Administrator Portal</p>
          </button>
        </div>

        <p className="mt-8 text-[10px] text-gray-400 font-medium">
          Hanya untuk personil berwenang.
        </p>
      </div>
    </main>
  );
}
