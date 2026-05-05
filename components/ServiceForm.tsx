"use client";

import { useState } from "react";
import { submitServiceRequest } from "@/app/actions";

export default function ServiceForm({
  serialNumber,
  userId,
}: {
  serialNumber: string;
  userId: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage("");

    const result = await submitServiceRequest(formData);

    if (result.success) {
      setMessage("✅ Laporan berhasil dikirim!");
      // Reset form jika perlu
      (document.getElementById("service-form") as HTMLFormElement).reset();
    } else {
      setMessage("❌ Gagal: " + result.message);
    }
    setIsPending(false);
  }

  return (
    <section className="bg-blue-50/50 p-6 rounded-[2.5rem] border border-blue-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-800 leading-none">
            Request Service
          </h3>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter mt-1">
            Layanan Teknis Cepat
          </p>
        </div>
      </div>

      <form id="service-form" action={handleSubmit} className="space-y-4">
        {/* Data Tersembunyi Otomatis */}
        <input type="hidden" name="serialNumber" value={serialNumber} />
        <input type="hidden" name="userId" value={userId} />

        <textarea
          name="description"
          required
          disabled={isPending}
          className="w-full border-0 bg-white shadow-inner rounded-2xl p-4 text-sm outline-none min-h-[120px] focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
          placeholder="Ceritakan kendala unit Anda..."
        ></textarea>

        {message && (
          <p
            className={`text-[10px] font-bold text-center uppercase tracking-widest ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isPending ? "Sedang Mengirim..." : "Kirim Laporan"}
        </button>
      </form>
    </section>
  );
}
