// app/page.tsx
import { cookies } from "next/headers";
import { SHOWCASES, USERS } from "@/lib/data";
import LogoutButton from "@/components/LogoutButton";
import UnitCard from "@/components/UnitCard";
import AuthErrorCard from "@/components/AuthErrorCard";
import { supabase } from "@/lib/supabase"; // Import helper supabase
import Link from "next/link";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const user = USERS.find((u) => u.id === userId);

  if (!user) return <AuthErrorCard />;

  const isAdmin = user.role === "admin";

  // 1. Ambil data laporan masuk (Khusus Admin)
  let allReports = [];
  if (isAdmin) {
    const { data } = await supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10); // Ambil 10 laporan terbaru

    allReports = data || [];
  }

  // 2. Logika Unit
  // Admin melihat SEMUA unit, Klien melihat unit miliknya saja
  const displayUnits = isAdmin
    ? SHOWCASES
    : SHOWCASES.filter((unit) => unit.ownerId === userId);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-12">
      <div className="max-w-md mx-auto">
        <header className="mb-10 pt-6 px-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
              <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.4em]">
                {isAdmin ? "Admin Control Center" : "Asset Management Portal"}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-end">
              <div>
                <h1 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">
                  Selamat Datang,
                </h1>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">
                  {user.clientName}
                </h2>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-1">
                <UserIcon />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-tight">
                {displayUnits.length} Unit {isAdmin ? "Total" : "Terpantau"}
              </p>
            </div>
            {isAdmin && allReports.length > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
                <p className="text-orange-600 text-[10px] font-bold uppercase tracking-tight">
                  {allReports.filter((r) => r.status === "pending").length}{" "}
                  Request Baru
                </p>
              </div>
            )}
          </div>
        </header>

        {/* --- SECTION KHUSUS ADMIN: LAPORAN MASUK --- */}
        {isAdmin && (
          <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-2 mb-4">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                Laporan Masuk Terbaru
              </p>
              <span className="text-[8px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                LIVE
              </span>
            </div>

            <div className="space-y-3">
              {allReports.length > 0 ? (
                allReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/unit/${SHOWCASES.find((u) => u.serialNumber === report.serial_number)?.id || "#"}`}
                    className="block bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-900">
                          {report.serial_number}
                        </span>
                        <span className="text-[8px] text-gray-400 font-bold uppercase">
                          {new Date(report.created_at).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" },
                          )}{" "}
                          •{" "}
                          {new Date(report.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-[7px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${report.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1 italic">
                      "{report.description}"
                    </p>
                  </Link>
                ))
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] py-8 text-center">
                  <p className="text-gray-400 text-[10px] font-bold uppercase italic">
                    Tidak ada laporan masuk.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- SECTION DAFTAR UNIT --- */}
        <section className="space-y-4 mb-10">
          <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {isAdmin ? "Manajemen Semua Inventaris" : "Daftar Inventaris"}
          </p>
          {displayUnits.length > 0 ? (
            displayUnits.map((unit) => <UnitCard key={unit.id} unit={unit} />)
          ) : (
            <p className="text-center text-gray-400 text-xs py-10">
              Belum ada unit terdaftar.
            </p>
          )}
        </section>

        <div className="px-2">
          <LogoutButton />
        </div>

        <footer className="mt-16 text-center">
          <div className="h-px w-12 bg-gray-200 mx-auto mb-6"></div>
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em]">
            Holicindo • 2026
          </p>
        </footer>
      </div>
    </main>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-600"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}
