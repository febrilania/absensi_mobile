import api from "@/src/api/api";
import { storage } from "@/src/utils/storage";

export async function getJadwalMahasiswa() {
  const token = await storage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan, silakan login ulang.");

  const response = await api.get("/jadwal", {
    headers: {
      XAuthorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Gagal memuat jadwal kuliah.");
  }

  return response.data.data;
}
