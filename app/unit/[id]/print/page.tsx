"use client";

import { SHOWCASES } from "@/lib/data";
import UnitQRCode from "@/components/UnitQRCode";
import { use } from "react";
import Link from "next/link";

export default function PrintLabelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const unit = SHOWCASES.find((u) => u.id === id);

  if (!unit)
    return (
      <div className="p-10 text-center font-black">UNIT TIDAK DITEMUKAN</div>
    );

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-8 pt-12">
      {/* 1. TOMBOL KEMBALI: Di bagian paling atas (no-print) */}
      <div className="w-full max-w-md mb-10 no-print">
        <Link
          href={`/unit/${unit.id}`}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all group w-fit"
        >
          <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">
            Kembali ke Detail
          </span>
        </Link>
      </div>

      {/* 2. CONTAINER LABEL QR: Berada di bawah tombol kembali */}
      <div className="flex flex-col items-center border-[6px] border-gray-900 p-12 rounded-[4rem] text-center shadow-sm bg-white">
        <p className="text-xs font-black uppercase tracking-[0.5em] text-gray-400 mb-8">
          Unit Passport QR
        </p>

        {/* Komponen QR */}
        <UnitQRCode serialNumber={unit.serialNumber} hideButton={true} />

        <div className="mt-10">
          <h1 className="text-5xl font-mono font-black text-gray-900 leading-none tracking-tighter">
            {unit.serialNumber}
          </h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase mt-3 tracking-[0.2em]">
            PT. Holicindo Dasa Anugerah
          </p>
        </div>
      </div>

      {/* 3. KONTROL CETAK: Di bagian bawah (no-print) */}
      <div className="mt-14 no-print flex flex-col items-center">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
        >
          Cetak Label
        </button>
        <p className="mt-6 text-gray-400 text-[9px] font-bold uppercase tracking-widest opacity-60">
          Gunakan pengaturan margin "None" saat mencetak
        </p>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          @page {
            margin: 0;
            size: auto;
          }
          main {
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 100vh !important;
          }
        }
      `}</style>
    </main>
  );
}
