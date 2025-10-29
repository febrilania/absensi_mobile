import { getRiwayatMengawas } from "@/src/api/dosen/riwayatMengawas";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export interface RiwayatItem {
  mata_kuliah: string;
  materi?: string;
  tanggal: string;
  jam: string;
  ruang: string;
  kelas: string;
  prodi: string;
  nama_dosen: string;
  sifat: string;
  hadir: number;
  jumlah_mhs: number;
  tidak_hadir: number;
  catatan?: string;
  tgl_presensi?: string;
  status_ujian?: string;
}

export const useRiwayatMengawas = () => {
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRiwayat = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRiwayatMengawas();

      if (data.success) {
        setRiwayat(data.data || []);
      } else {
        Alert.alert("Gagal", data.message || "Tidak ada data riwayat.");
      }
    } catch (error: any) {
      console.error("Error riwayat:", error.response?.data || error);
      Alert.alert("Error", "Gagal memuat data riwayat.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRiwayat();
  };

  return {
    riwayat,
    loading,
    refreshing,
    fetchRiwayat,
    onRefresh,
  };
};
