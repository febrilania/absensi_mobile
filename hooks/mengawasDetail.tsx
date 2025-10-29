import {
    generateAllPresensi,
    saveCatatan,
    selesaiUjian,
    updateAbsen,
} from "@/src/api/mengawasDetail";
import { useState } from "react";
import { Alert } from "react-native";

export function useMengawasDetail(parsed: any, router: any) {
  const [loading, setLoading] = useState(false);
  const [mahasiswa, setMahasiswa] = useState(parsed.mahasiswa);
  const [catatan, setCatatan] = useState(parsed.catatan || "");
  const [savingCatatan, setSavingCatatan] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [isSelesai, setIsSelesai] = useState(
    parsed.status_ujian === "Ujian Selesai"
  );

  const handleGenerateAll = async () => {
    if (isSelesai) return Alert.alert("Ujian sudah selesai");
    try {
      setLoading(true);
      const res = await generateAllPresensi(parsed.token_id);
      if (res.data.success) {
        Alert.alert("Berhasil", "Semua mahasiswa ditandai hadir");
        setMahasiswa((prev: any[]) =>
          prev.map((mhs: any) => ({ ...mhs, absen: 2 }))
        );
      }
    } catch {
      Alert.alert("Error", "Gagal generate presensi");
    } finally {
      setLoading(false);
    }
  };

  const handleAbsen = async (nim: string, status: string) => {
    if (isSelesai) return;
    try {
      setLoading(true);
      await updateAbsen(parsed.token_id, nim, status);
      setMahasiswa((prev: any[]) =>
        prev.map((mhs: any) =>
          mhs.nim === nim ? { ...mhs, absen: parseInt(status) } : mhs
        )
      );
    } catch {
      Alert.alert("Error", "Gagal memperbarui presensi");
    } finally {
      setLoading(false);
    }
  };

  const handleSimpanCatatan = async () => {
    if (isSelesai) return;
    try {
      setSavingCatatan(true);
      await saveCatatan(parsed.token_id, catatan);
      Alert.alert("Berhasil", "Catatan berhasil disimpan");
    } catch {
      Alert.alert("Error", "Gagal menyimpan catatan");
    } finally {
      setSavingCatatan(false);
    }
  };

  const handleSelesaiUjian = async () => {
    Alert.alert("Konfirmasi", "Selesaikan ujian ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya, Selesai",
        onPress: async () => {
          try {
            setFinishing(true);
            const res = await selesaiUjian(parsed.token_id);
            if (res.data.success) {
              setIsSelesai(true);
              Alert.alert("Berhasil", "Ujian telah diselesaikan!", [
                {
                  text: "OK",
                  onPress: () =>
                    router.replace({
                      pathname: "/(tabsKaryawan)/scan",
                      params: {
                        qr_token: parsed.qr_token,
                        refresh: "true",
                        stayOnResult: "true",
                      },
                    }),
                },
              ]);
            }
          } catch {
            Alert.alert("Error", "Gagal menyelesaikan ujian");
          } finally {
            setFinishing(false);
          }
        },
      },
    ]);
  };

  return {
    mahasiswa,
    catatan,
    setCatatan,
    handleAbsen,
    handleGenerateAll,
    handleSelesaiUjian,
    handleSimpanCatatan,
    loading,
    savingCatatan,
    finishing,
    isSelesai,
  };
}
