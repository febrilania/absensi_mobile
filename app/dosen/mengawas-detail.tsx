import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MengawasDetail() {
  const router = useRouter();
  const { data, source } = useLocalSearchParams(); // ✅ Tambah source
  const parsed = JSON.parse(data as string);

  const [loading, setLoading] = useState(false);
  const [mahasiswa, setMahasiswa] = useState(parsed.mahasiswa);
  const [catatan, setCatatan] = useState(parsed.catatan || "");
  const [savingCatatan, setSavingCatatan] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // ✅ Deteksi ujian selesai
  const [isSelesai, setIsSelesai] = useState(
    parsed.status_ujian === "Ujian Selesai"
  );

  const formatTanggal = (tanggal: string) => {
    try {
      const date = new Date(tanggal);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return tanggal;
    }
  };

  // === Generate semua hadir ===
  const handleGenerateAll = async () => {
    if (isSelesai) {
      Alert.alert("Ujian sudah selesai", "Presensi tidak dapat diubah lagi.");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/presensiujian", {
        idtoken: parsed.token_id,
        mode: "all",
      });
      if (response.data.success) {
        Alert.alert("Berhasil", "Semua mahasiswa ditandai hadir.");
        setMahasiswa((prev: any[]) =>
          prev.map((mhs: any) => ({ ...mhs, absen: 2 }))
        );
      }
    } catch {
      Alert.alert("Error", "Terjadi kesalahan saat generate presensi.");
    } finally {
      setLoading(false);
    }
  };

  // === Selesai ujian ===
  const handleSelesaiUjian = async () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menyelesaikan ujian ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Selesai",
          onPress: async () => {
            try {
              setFinishing(true);

              const response = await api.post("/selesaiujian", {
                token_id: parsed.token_id,
              });

              if (response.data.success) {
                setIsSelesai(true);

                Alert.alert("Berhasil", "Ujian telah diselesaikan!", [
                  {
                    text: "OK",
                    onPress: () => {
                      // 🔹 Balik ke hasil scan (bukan kamera)
                      router.replace({
                        pathname: "/(tabsDosen)/scan",
                        params: {
                          qr_token: parsed.qr_token, // kirim token QR lama
                          refresh: "true", // sinyal untuk reload data
                          stayOnResult: "true", // biar gak buka kamera
                        },
                      });
                    },
                  },
                ]);
              } else {
                Alert.alert(
                  "Gagal",
                  response.data.message || "Gagal menyelesaikan ujian."
                );
              }
            } catch {
              Alert.alert(
                "Error",
                "Terjadi kesalahan saat menyelesaikan ujian."
              );
            } finally {
              setFinishing(false);
            }
          },
        },
      ]
    );
  };

  // === Ubah status absen ===
  const handleAbsen = async (nim: string, status: string) => {
    if (isSelesai) return;
    try {
      setLoading(true);
      await api.post("/presensiujian", {
        idtoken: parsed.token_id,
        mode: "manual",
        nim,
        status,
      });
      setMahasiswa((prev: any[]) =>
        prev.map((mhs: any) =>
          mhs.nim === nim ? { ...mhs, absen: parseInt(status) } : mhs
        )
      );
    } catch {
      Alert.alert("Error", "Gagal memperbarui presensi.");
    } finally {
      setLoading(false);
    }
  };

  // === Simpan catatan ===
  const handleSimpanCatatan = async () => {
    if (isSelesai) return;
    try {
      setSavingCatatan(true);
      await api.post("/presensiujian", {
        idtoken: parsed.token_id,
        mode: "catatan",
        catatan,
      });
      Alert.alert("Berhasil", "Catatan berhasil disimpan.");
    } catch {
      Alert.alert("Error", "Gagal menyimpan catatan.");
    } finally {
      setSavingCatatan(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Mengawas</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* KONTEN */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <Text style={styles.title}>{parsed.materi}</Text>
          <Text style={styles.title}>
            Tahun Akademik {parsed.tahun_akademik}
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.title}>{parsed.makul}</Text>
            <Text style={styles.label}>
              Tanggal: {formatTanggal(parsed.tanggal)}
            </Text>
            <Text style={styles.label}>Ruang: {parsed.ruang}</Text>
            <Text style={styles.label}>Kelas: {parsed.kelas}</Text>
            <Text style={styles.label}>Dosen: {parsed.dosen}</Text>
            <Text style={styles.label}>
              Jumlah Mahasiswa: {parsed.jumlah_mahasiswa}
            </Text>

            <View
              style={[
                styles.badge,
                isSelesai ? styles.badgeDone : styles.badgeActive,
              ]}
            >
              <Text style={styles.badgeText}>
                {isSelesai ? "Ujian Selesai" : "Sedang Berlangsung"}
              </Text>
            </View>
          </View>

          {/* CATATAN */}
          <View style={styles.catatanBox}>
            <Text style={styles.catatanLabel}>Catatan Pengawas:</Text>
            <TextInput
              style={[
                styles.catatanInput,
                isSelesai && { backgroundColor: "#eee" },
              ]}
              editable={!isSelesai}
              value={catatan}
              onChangeText={setCatatan}
              multiline
            />
            {!isSelesai && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleSimpanCatatan}
                disabled={savingCatatan}
              >
                {savingCatatan ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>💾 Simpan Catatan</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* BUTTONS */}
          {!isSelesai && (
            <>
              <TouchableOpacity
                style={[styles.button, { marginBottom: 10 }]}
                onPress={handleGenerateAll}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    📋 Generate Presensi (Hadir Semua)
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#2E8B57" }]}
                onPress={handleSelesaiUjian}
                disabled={finishing}
              >
                {finishing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>✅ Selesai Ujian</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {isSelesai && (
            <Text
              style={{
                textAlign: "center",
                color: "#2E8B57",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              ✅ Ujian telah diselesaikan. Semua fitur dinonaktifkan.
            </Text>
          )}

          {/* MAHASISWA */}
          <Text style={styles.subTitle}>Daftar Mahasiswa:</Text>
          <FlatList
            data={mahasiswa}
            keyExtractor={(item) => item.nim}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.nama}>{item.nama}</Text>
                <Text style={styles.label}>NIM: {item.nim}</Text>
                <Text
                  style={[styles.absenStatus, { color: getColor(item.absen) }]}
                >
                  Status: {getStatusText(item.absen)}
                </Text>
                <View style={styles.buttonRow}>
                  {[
                    { label: "Alpa", value: "1" },
                    { label: "Hadir", value: "2" },
                    { label: "Ijin", value: "3" },
                    { label: "Sakit", value: "4" },
                    { label: "Dispensasi", value: "5" },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.absenButton,
                        item.absen === parseInt(opt.value) &&
                          styles.absenButtonActive,
                        isSelesai && { opacity: 0.5 },
                      ]}
                      onPress={() => handleAbsen(item.nim, opt.value)}
                      disabled={loading || isSelesai}
                    >
                      <Text
                        style={[
                          styles.absenButtonText,
                          item.absen === parseInt(opt.value) && {
                            color: "#fff",
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

// === Helper ===
function getStatusText(absen: number) {
  switch (absen) {
    case 1:
      return "Alpa";
    case 2:
      return "Hadir";
    case 3:
      return "Ijin";
    case 4:
      return "Sakit";
    case 5:
      return "Dispensasi";
    default:
      return "Belum Absen";
  }
}
function getColor(absen: number) {
  switch (absen) {
    case 2:
      return "#2E8B57";
    case 1:
      return "#DC143C";
    case 3:
      return "#FF8C00";
    case 4:
      return "#4682B4";
    case 5:
      return "#8A2BE2";
    default:
      return "#555";
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1E90FF",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  container: { flex: 1, backgroundColor: "#E8F1FF", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1E90FF" },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginVertical: 10,
    elevation: 3,
  },
  label: { fontSize: 15, color: "#333" },
  badge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeActive: { backgroundColor: "#1E90FF" },
  badgeDone: { backgroundColor: "#2E8B57" },
  badgeText: { color: "#fff", fontWeight: "600" },
  catatanBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  },
  catatanLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E90FF",
    marginBottom: 6,
  },
  catatanInput: {
    borderWidth: 1,
    borderColor: "#1E90FF",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    backgroundColor: "#F8FBFF",
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    elevation: 3,
  },
  nama: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1E90FF",
  },
  absenStatus: { fontSize: 15, fontWeight: "500", marginBottom: 8 },
  buttonRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  absenButton: {
    borderWidth: 1,
    borderColor: "#1E90FF",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginTop: 4,
  },
  absenButtonActive: { backgroundColor: "#1E90FF" },
  absenButtonText: { color: "#1E90FF", fontSize: 13, fontWeight: "600" },
});
