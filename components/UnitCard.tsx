// components/UnitCard.tsx
"use client";
import Link from "next/link";

export default function UnitCard({ unit }: { unit: any }) {
  const isExpired = new Date(unit.warrantyExpiry) < new Date();

  return (
    <Link
      href={`/unit/${unit.id}`}
      className="block active:scale-[0.98] transition-transform"
    >
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-300 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Showcase ID
            </p>
            <h3 className="text-xl font-mono font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tighter">
              {unit.serialNumber}
            </h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
              isExpired
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-green-50 text-green-600 border border-green-100"
            }`}
          >
            {isExpired ? "Expired" : "Active"}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center text-blue-600 text-[11px] font-black uppercase tracking-tighter gap-2">
            Akses Digital Twin
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          <p className="text-[10px] text-gray-300 font-mono font-bold">
            {unit.specs.compressor}
          </p>
        </div>
      </div>
    </Link>
  );
}
