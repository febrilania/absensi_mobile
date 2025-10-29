import { getJadwalUjian } from "@/src/api/ujian";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useUts() {
  const [loading, setLoading] = useState(false);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [filteredJadwal, setFilteredJadwal] = useState<any[]>([]);
  const [selectedHari, setSelectedHari] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchJadwal();
    }, [])
  );

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const data = await getJadwalUjian(1); // ✅ 1 = UTS
      setJadwal(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal memuat jadwal UTS.");
    } finally {
      setLoading(false);
    }
  };

  const filterByHari = (hari: number) => {
    setSelectedHari(hari);
    setFilteredJadwal(jadwal.filter((item) => item.hari == hari));
  };

  return {
    loading,
    filteredJadwal,
    selectedHari,
    filterByHari,
  };
}
