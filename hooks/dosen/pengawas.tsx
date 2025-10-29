import { getPengawasData, postMengawas } from "@/src/api/dosen/pengawas";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function usePengawas() {
  const [visible, setVisible] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [tanggal, setTanggal] = useState("");
  const [qr, setQr] = useState("");
  const router = useRouter();

  // === buka modal setiap halaman aktif ===
  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      if (qr) fetchPengawas(qr);
      return () => setVisible(false);
    }, [qr])
  );

  const fetchPengawas = async (kode: string) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const data = await getPengawasData(token, kode);
      if (data.success) {
        setTanggal(data.tanggal);
        setQr(data.qr || kode);
        setJadwal(data.data || []);
      } else {
        Alert.alert("Gagal", data.message || "Tidak ada data ditemukan.");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Gagal memuat data pengawas."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!manualCode) {
      Alert.alert("Error", "Kode tidak boleh kosong");
      return;
    }
    setQr(manualCode);
    await fetchPengawas(manualCode);
  };

  const handleCardPress = async (item: any) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const data = await postMengawas(token, item.id, qr);
      if (data.success) {
        data.status_ujian = item.status_ujian;
        router.push({
          pathname: "/pages/dosen/mengawas-detail",
          params: { data: JSON.stringify(data) },
        });
      } else {
        Alert.alert("Gagal", data.message || "Tidak bisa memproses data.");
      }
    } catch (error: any) {
      Alert.alert("Error", "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setManualCode("");
    setJadwal([]);
    setTanggal("");
    setQr("");
    setVisible(false);
    router.replace("/beranda");
  };

  return {
    visible,
    manualCode,
    loading,
    jadwal,
    tanggal,
    qr,
    setManualCode,
    setVisible,
    handleSubmit,
    handleCardPress,
    handleCancel,
  };
}
