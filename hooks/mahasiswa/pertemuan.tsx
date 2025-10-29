import { getPertemuan } from "@/src/api/mahasiswa/pertemuan";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const usePertemuan = (kd_ajar?: string | string[]) => {
  const [pertemuan, setPertemuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPertemuan = useCallback(async () => {
    if (!kd_ajar) return;
    const kode = Array.isArray(kd_ajar) ? kd_ajar[0] : kd_ajar;
    try {
      if (!refreshing) setLoading(true);
      const data = await getPertemuan(kode);
      setPertemuan(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal memuat data pertemuan");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [kd_ajar, refreshing]);

  useEffect(() => {
    fetchPertemuan();
  }, [fetchPertemuan]);

  return { pertemuan, loading, refreshing, setRefreshing, fetchPertemuan };
};
