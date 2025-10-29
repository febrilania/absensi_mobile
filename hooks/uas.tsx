import { getJadwalUjian } from "@/src/api/ujian";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useUas() {
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
      const data = await getJadwalUjian(2); // 2 = UAS
      setJadwal(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal memuat jadwal UAS.");
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
