import {
  getJadwalPengawas,
  postDetailMengawas,
} from "@/src/api/dosen/pengawasScan";
import { storage } from "@/src/utils/storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useScanMengawas() {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const router = useRouter();
  const { refresh, qr_token, stayOnResult } = useLocalSearchParams();

  const fetchJadwal = useCallback(async (kode: string) => {
    try {
      setLoading(true);
      const token = await storage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan. Silakan login ulang.");
        return;
      }
      const data = await getJadwalPengawas(token, kode);
      if (data.success) {
        setJadwal(data.data || []);
      } else {
        Alert.alert("Gagal", data.message || "Tidak ada data ditemukan.");
      }
    } catch (error: any) {
      Alert.alert("Error", "Gagal memuat data pengawas.");
    } finally {
      setLoading(false);
    }
  }, []);

  const openDetail = useCallback(
    async (item: any) => {
      try {
        setLoading(true);
        const token = await storage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Token tidak ditemukan.");
          return;
        }
        const data = await postDetailMengawas(token, item.id, qrToken);
        if (data.success) {
          const payload = {
            ...data,
            status_ujian: item.status_ujian,
            qr_token: qrToken,
          };
          router.push({
            pathname: "/pages/karyawan/mengawas-detail",
            params: {
              data: JSON.stringify(payload),
              source: "scan",
            },
          });
        } else {
          Alert.alert("Gagal", data.message || "Tidak bisa memproses data.");
        }
      } catch (error: any) {
        Alert.alert("Error", "Terjadi kesalahan saat membuka detail.");
      } finally {
        setLoading(false);
      }
    },
    [qrToken]
  );

  // === Auto refresh kalau balik dari detail ===
  useFocusEffect(
    useCallback(() => {
      if (refresh === "true" && (qr_token || qrToken)) {
        const tokenString = Array.isArray(qr_token) ? qr_token[0] : qr_token;
        const finalToken =
          typeof tokenString === "string" ? tokenString : qrToken;

        if (finalToken) {
          setScanned(true);
          fetchJadwal(finalToken);
        }
      }
    }, [refresh, qr_token, qrToken])
  );

  // === Jalankan jika user ingin tetap di hasil (stayOnResult) ===
  useEffect(() => {
    if (stayOnResult === "true" && qr_token) {
      setScanned(true);
      setQrToken(qr_token as string);
      fetchJadwal(qr_token as string);
    }
  }, [stayOnResult, qr_token]);

  const resetScan = useCallback(() => {
    setScanned(false);
    setJadwal([]);
    setQrToken("");
  }, []);

  return {
    jadwal,
    loading,
    scanned,
    setScanned,
    qrToken,
    setQrToken,
    fetchJadwal,
    openDetail,
    resetScan,
  };
}
