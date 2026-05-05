// components/AuthErrorCard.tsx
import React from "react";

export default function AuthErrorCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center font-sans">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 max-w-sm w-full transition-all duration-500 hover:shadow-2xl">
        {/* Shield Icon - Melambangkan Keamanan */}
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Heading & Subtext */}
        <h1 className="text-2xl font-black text-gray-900 mb-2 italic tracking-tight">
          Akses Terbatas
        </h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed font-medium">
          Sesi Anda tidak ditemukan. Silakan login kembali untuk mengakses
          layanan{" "}
          <span className="text-blue-600 font-bold">B2B Digital Twin</span>.
        </p>

        {/* Console Box untuk Simulasi Demo */}
        <div className="bg-gray-950 p-5 rounded-2xl text-left text-[11px] font-mono text-blue-300 break-all shadow-inner relative group border border-gray-800">
          <div className="absolute -top-2 left-4 bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest">
            Dev Console Command
          </div>
          <p className="opacity-70 text-gray-500 mb-1">
            // Copy & paste di browser console:
          </p>
          <code className="select-all">
            document.cookie = "user_id=u1; path=/";
          </code>
        </div>

        {/* Brand Footer */}
        <p className="mt-8 text-[10px] text-gray-300 uppercase font-black tracking-[0.3em]">
          PT. Holicindo Dasa Anugerah
        </p>
      </div>
    </div>
  );
}
