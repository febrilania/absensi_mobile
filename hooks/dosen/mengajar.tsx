import { getMengajar } from "@/src/api/dosen/mengajar";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useMengajar() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMengajar = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await getMengajar();

      if (res.success) {
        setData(res.data || []);
      } else {
        Alert.alert("Gagal", res.message || "Tidak dapat memuat data.");
      }
    } catch (err) {
      Alert.alert("Error", "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchMengajar();
  }, []);

  return { data, loading, refreshing, setRefreshing, fetchMengajar };
}
