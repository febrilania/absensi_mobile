import api from "@/src/api/api";
import { storage } from "@/src/utils/storage";

export const getRiwayatMengawas = async () => {
  const token = await storage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await api.get("/riwayatmengawas", {
    headers: { XAuthorization: `Bearer ${token}` },
  });

  return response.data;
};
