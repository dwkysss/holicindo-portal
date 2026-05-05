"use server";

import { createClient } from "@supabase/supabase-js";

// Inisialisasi client menggunakan Env yang ditarik dari Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function submitServiceRequest(formData: FormData) {
  const serialNumber = formData.get("serialNumber") as string;
  const description = formData.get("description") as string;
  const userId = formData.get("userId") as string;

  const { data, error } = await supabase.from("service_requests").insert([
    {
      serial_number: serialNumber,
      description: description,
      user_id: userId,
      status: "pending",
    },
  ]);

  if (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Gagal mengirim laporan." };
  }

  return { success: true, message: "Laporan berhasil dikirim!" };
}
