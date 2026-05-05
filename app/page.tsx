// app/page.tsx
import { cookies } from "next/headers";
import { SHOWCASES, USERS } from "@/lib/data";
import LogoutButton from "@/components/LogoutButton";
import UnitCard from "@/components/UnitCard";
import AuthErrorCard from "@/components/AuthErrorCard"; // Opsional: Pisahkan view error

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const user = USERS.find((u) => u.id === userId);

  // Jika tidak ada user, tampilkan view proteksi
  if (!user) return <AuthErrorCard />;

  // Optimasi: Filter data hanya sekali
  const myUnits = SHOWCASES.filter((unit) => unit.ownerId === userId);
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
                Asset Management Portal
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
                {myUnits.length} Unit Terpantau
              </p>
            </div>
            <div className="h-4 w-px bg-gray-200"></div>
            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">
              {currentDate}
            </p>
          </div>
        </header>

        <section className="space-y-4 mb-10">
          <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Daftar Inventaris
          </p>
          {myUnits.length > 0 ? (
            myUnits.map((unit) => <UnitCard key={unit.id} unit={unit} />)
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

// Komponen Icon Internal untuk kerapihan
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
