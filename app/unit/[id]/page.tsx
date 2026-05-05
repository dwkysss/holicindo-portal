// app/unit/[id]/page.tsx
import { SHOWCASES, USERS } from "@/lib/data";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import ServiceForm from "@/components/ServiceForm";
// Import helper supabase untuk mengambil data riwayat
import { supabase } from "@/lib/supabase";

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

  if (!currentUser) return redirect("/gateway");

  // 3. Logika Bisnis & Otorisasi
  const isExpired = new Date(unit.warrantyExpiry) < new Date();
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

  // 4. Ambil Riwayat Laporan (Khusus untuk tampilan Admin)
  let serviceHistory = [];
  if (isAdmin) {
    const { data } = await supabase
      .from("service_requests")
      .select("*")
      .eq("serial_number", unit.serialNumber)
      .order("created_at", { ascending: false });

    serviceHistory = data || [];
  }

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

            {/* KONDISIONAL: Tampilan Admin (Riwayat) vs Klien (Formulir) */}
            {isAdmin ? (
              <section className="bg-white p-6 rounded-[2.5rem] border-2 border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-orange-500 p-2 rounded-lg text-white shadow-lg shadow-orange-100">
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest">
                    Riwayat Kendala
                  </h3>
                </div>

                {serviceHistory.length === 0 ? (
                  <p className="text-[9px] text-gray-400 font-bold text-center py-4 uppercase italic tracking-tighter">
                    Belum ada laporan kendala.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {serviceHistory.map((report: any) => (
                      <div
                        key={report.id}
                        className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] font-black text-blue-500 uppercase">
                            {new Date(report.created_at).toLocaleDateString(
                              "id-ID",
                              { day: "2-digit", month: "short" },
                            )}
                          </span>
                          <span
                            className={`text-[7px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${report.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium leading-relaxed italic">
                          "{report.description}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <ServiceForm
                serialNumber={unit.serialNumber}
                userId={currentUser.id}
              />
            )}
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
