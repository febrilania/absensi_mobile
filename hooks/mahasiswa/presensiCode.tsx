import { submitPresensiManual } from "@/src/api/mahasiswa/presensiMhs";
import { useState } from "react";
import { Alert } from "react-native";

export const usePresensiManual = () => {
  const [loading, setLoading] = useState(false);

  const submitManual = async (manualCode: string) => {
    if (!manualCode) {
      Alert.alert("Error", "Kode tidak boleh kosong");
      return false;
    }

    try {
      setLoading(true);
      const result = await submitPresensiManual(manualCode);
      Alert.alert("Berhasil", result?.message || "Presensi berhasil!");
      return true;
    } catch (error: any) {
      Alert.alert("Gagal", error.response?.data?.message || "Presensi gagal.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, submitManual };
};
