import api from "@/src/api/api";
import * as SecureStore from "expo-secure-store";

export const submitPresensiManual = async (manualCode: string) => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await api.post(
    "/presensi/scan",
    { qr_token: manualCode },
    {
      headers: {
        XAuthorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const submitPresensiScan = async (code: string) => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await api.post(
    "/presensi/scan",
    { qr_token: code },
    {
      headers: {
        XAuthorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
