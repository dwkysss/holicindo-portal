// app/unit/[id]/page.tsx
import { SHOWCASES, USERS } from "@/lib/data";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const unit = SHOWCASES.find((u) => u.id === id);

  // 1. Validasi Keberadaan Unit
  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="p-10 text-center font-bold bg-white rounded-[2rem] shadow-sm border border-gray-100">
          Unit Tidak Ditemukan
        </div>
      </div>
    );
  }

  // 2. Autentikasi: Ambil identitas dari cookie Gateway
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const currentUser = USERS.find((u) => u.id === userId);

  // Jika tidak ada sesi aktif, arahkan ke Gateway (Launcher)
  if (!currentUser) return redirect("/gateway");

  // 3. Logika Bisnis: Cek Garansi
  const isExpired = new Date(unit.warrantyExpiry) < new Date();

  // 4. Otorisasi (RBAC): Admin memiliki akses penuh, Klien hanya unit miliknya
  const isOwner = unit.ownerId === currentUser.id;
  const isAdmin = currentUser.role === "admin";

  if (!isAdmin && !isOwner) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-red-100 text-center max-w-sm">
          <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Akses Ditolak
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            Identitas {currentUser.clientName} tidak memiliki izin akses untuk
            unit {unit.serialNumber}.
          </p>
          <Link
            href="/"
            className="mt-8 block bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-transform"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // 5. Tampilan Detail Unit
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 pb-12 font-sans">
      <div className="w-full max-w-md">
        {/* Navigasi Atas */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="bg-white p-2 rounded-full shadow-sm border border-gray-100 hover:bg-blue-50 transition-colors"
          >
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            Unit Passport {isAdmin && "• Admin View"}
          </span>
          <div className="w-10"></div>
        </div>

        {/* Card Passport Utama */}
        <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100 mb-6">
          <div className="relative h-64 bg-gray-200">
            <Image
              src={unit.imageUrl || "/images/placeholder-showcase.webp"}
              alt={`Showcase ${unit.serialNumber}`}
              fill
              className="object-cover"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
            <div className="absolute top-6 right-6 z-20">
              <div
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md ${isExpired ? "bg-red-500/90" : "bg-green-500/90"}`}
              >
                {isExpired ? "Garansi Expired" : "Garansi Aktif"}
              </div>
            </div>
          </div>

          <div className="p-8">
            <section className="mb-8">
              <p className="text-blue-600 text-[10px] uppercase font-black tracking-widest mb-1">
                Identitas Digital
              </p>
              <h1 className="text-4xl font-mono font-black text-gray-900 tracking-tighter">
                {unit.serialNumber}
              </h1>
            </section>

            {/* Spesifikasi Teknis */}
            <section className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-[9px] uppercase font-black mb-1">
                  Compressor
                </p>
                <p className="text-sm font-bold text-gray-700 leading-tight">
                  {unit.specs.compressor}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-[9px] uppercase font-black mb-1">
                  Glass Specs
                </p>
                <p className="text-sm font-bold text-gray-700 leading-tight">
                  {unit.specs.glass}
                </p>
              </div>
            </section>

            {/* Aset Fisik: Cetak Label */}
            <section className="mb-8">
              <Link
                href={`/unit/${unit.id}/print`}
                className="w-full bg-white border-2 border-dashed border-gray-200 p-6 rounded-[2.5rem] flex flex-col items-center hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="bg-gray-50 p-3 rounded-2xl mb-3 group-hover:bg-blue-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 group-hover:text-blue-600"
                  >
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-blue-600">
                  Buka Mode Cetak Label
                </span>
              </Link>
            </section>

            {/* Portal Layanan */}
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
              <form className="space-y-4">
                <input
                  type="hidden"
                  name="serial_number"
                  value={unit.serialNumber}
                />
                <textarea
                  required
                  className="w-full border-0 bg-white shadow-inner rounded-2xl p-4 text-sm outline-none min-h-[120px]"
                  placeholder="Ceritakan kendala unit Anda..."
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-transform"
                >
                  Kirim Laporan
                </button>
              </form>
            </section>
          </div>
        </div>

        <footer className="mt-10 text-center">
          <p className="text-[10px] font-bold tracking-[0.4em] text-gray-300 uppercase">
            PT. HOLICINDO DASA ANUGERAH
          </p>
        </footer>
      </div>
    </main>
  );
}
