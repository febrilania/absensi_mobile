import * as SecureStore from "expo-secure-store";
import api from "./api";

/**
 * Ambil jadwal ujian (UTS/UAS)
 * @param ujian 1 = UTS, 2 = UAS
 */
export async function getJadwalUjian(ujian: number) {
  const token = await SecureStore.getItemAsync("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await api.post(
    "/jadwalujian",
    { ujian },
    { headers: { XAuthorization: `Bearer ${token}` } }
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Gagal memuat jadwal ujian");
  }

  const data = res.data.data || [];

  // Urutkan tanggal & jam
  return data.sort((a: any, b: any) => {
    const dateA = new Date(`${a.tanggal} ${a.jam}`);
    const dateB = new Date(`${b.tanggal} ${b.jam}`);
    return dateA.getTime() - dateB.getTime();
  });
}
