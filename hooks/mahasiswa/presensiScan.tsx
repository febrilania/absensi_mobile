import { submitPresensiScan } from "@/src/api/mahasiswa/presensiMhs";
import { useState } from "react";
import { Alert } from "react-native";

export const usePresensiScan = () => {
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = async (code: string) => {
    if (!code) return;
    try {
      setLoading(true);
      setScanned(true);

      const data = await submitPresensiScan(code);
      Alert.alert("Berhasil", data?.message || "Presensi berhasil!");
    } catch (error: any) {
      Alert.alert("Gagal", error.response?.data?.message || "Presensi gagal.");
    } finally {
      setLoading(false);
      // Biar bisa scan ulang setelah 2 detik
      setTimeout(() => setScanned(false), 2000);
    }
  };

  return { loading, scanned, handleScan };
};
