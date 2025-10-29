import { RiwayatItem } from "@/components/mahasiswa/riwayatCard";
import { getRiwayatPresensi } from "@/src/api/mahasiswa/riwayat";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useRiwayat = () => {
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const data = await getRiwayatPresensi();
      setRiwayat(data);
    } catch (error) {
      console.error("Error GetRiwayatData:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return { riwayat, loading, fetchRiwayat };
};
