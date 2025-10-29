import api from "@/src/api/api";
import * as SecureStore from "expo-secure-store";

export const getPertemuan = async (kd_ajar: string) => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await api.get(`/pertemuan?kode=${kd_ajar}`, {
    headers: {
      XAuthorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.data?.success) {
    return Array.isArray(response.data.data) ? response.data.data : [];
  }

  throw new Error("Gagal memuat data pertemuan");
};
