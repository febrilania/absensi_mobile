import api from "@/src/api/api";
import * as SecureStore from "expo-secure-store";

export const getRiwayatMengawas = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await api.get("/riwayatmengawas", {
    headers: { XAuthorization: `Bearer ${token}` },
  });

  return response.data;
};
