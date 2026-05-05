// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Menghapus cookie user_id dengan mengatur tanggal kadaluwarsa ke masa lalu
    document.cookie =
      "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Refresh atau arahkan ke halaman utama agar middleware/proxy beraksi
    router.refresh();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-8 w-full py-3 text-red-500 text-xs font-bold border-2 border-dashed border-red-100 rounded-xl hover:bg-red-50 transition-colors"
    >
      LOGOUT & RESET SESSION
    </button>
  );
}
