import { getJadwalMahasiswa } from "@/src/api/mahasiswa/jadwal";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useJadwal() {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const fetchJadwal = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getJadwalMahasiswa();
      setJadwal(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal memuat jadwal.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJadwal();
  }, [fetchJadwal]);

  const filteredJadwal = selectedDay
    ? jadwal.filter((item) => item.hari === selectedDay)
    : [];

  return { jadwal, loading, selectedDay, setSelectedDay, filteredJadwal };
}
