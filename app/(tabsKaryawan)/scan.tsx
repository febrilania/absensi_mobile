import api from "@/src/api/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [tanggal, setTanggal] = useState("");
  const [qrToken, setQrToken] = useState("");
  const router = useRouter();

  // 🔹 Ambil parameter dari navigasi (jika balik dari detail)
  const { refresh, qr_token, stayOnResult } = useLocalSearchParams();

  // === Ambil jadwal dari server ===
  const fetchJadwal = async (qr_data?: string) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const response = await api.post(
        "/pengawas",
        { qr_token: qr_data || qrToken },
        {
          headers: {
            "Content-Type": "application/json",
            XAuthorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setJadwal(response.data.data || []);
        setTanggal(response.data.tanggal);
      } else {
        Alert.alert("Gagal", response.data.message || "Data tidak ditemukan.");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Gagal memuat data jadwal."
      );
    } finally {
      setLoading(false);
    }
  };

  // === Auto refresh kalau balik dari detail ujian ===
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

  // === Jalankan jika user baru kembali dari detail dengan stayOnResult ===
  useEffect(() => {
    if (stayOnResult === "true") {
      setScanned(true);
      setQrToken(qr_token as string);
      fetchJadwal(qr_token as string);
    }
  }, [stayOnResult, qr_token]);

  // === Minta izin kamera pertama kali ===
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // === Saat QR discan ===
  const handleBarcodeScanned = async (scanningResult: any) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    const qrData = scanningResult?.data;
    if (!qrData) {
      Alert.alert("Error", "QR Code tidak valid");
      setScanned(false);
      return;
    }

    setQrToken(qrData);
    await fetchJadwal(qrData);
    setLoading(false);
  };

  // === Klik card jadwal untuk masuk ke halaman detail ===
  const handleCardPress = async (item: any) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const response = await api.post(
        "/mengawas",
        {
          id: item.id,
          qr_token: qrToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            XAuthorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // 🔹 Gabungkan data response dan status ujian ke satu objek
        const payload = {
          ...response.data,
          status_ujian: item.status_ujian,
          qr_token: qrToken, // penting untuk balik ke hasil scan
        };

        router.push({
          pathname: "/karyawan/mengawas-detail",
          params: {
            data: JSON.stringify(payload),
            source: "scan",
          },
        });
      } else {
        Alert.alert(
          "Gagal",
          response.data.message || "Tidak bisa memproses data."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  };

  // === Jika izin kamera belum didapat ===
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Memeriksa izin kamera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Izin kamera belum diberikan.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // === Tampilan utama ===
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E8F1FF" }}>
      {!scanned ? (
        // 🔹 Tampilan kamera QR scanner
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.scannerBox} />
            <Text style={styles.overlayText}>Arahkan kamera ke QR Code</Text>
          </View>
        </CameraView>
      ) : (
        // 🔹 Tampilan daftar jadwal setelah QR berhasil discan
        <View style={styles.container}>
          <Text style={styles.title}>📋 Jadwal Mengawas</Text>

          {loading && <ActivityIndicator size="large" color="#1E90FF" />}

          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {jadwal.length === 0 && !loading ? (
              <View style={styles.center}>
                <Text style={{ color: "#555", marginTop: 20 }}>
                  Tidak ada jadwal pengawas hari ini.
                </Text>
              </View>
            ) : (
              <>
                {jadwal.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleCardPress(item)}
                  >
                    <View style={styles.card}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.matkul}>{item.mata_kuliah}</Text>
                        <View
                          style={[
                            styles.badge,
                            item.status_ujian === "Ujian Selesai"
                              ? styles.badgeDone
                              : styles.badgeActive,
                          ]}
                        >
                          <Text style={styles.badgeText}>
                            {item.status_ujian === "Ujian Selesai"
                              ? "Ujian Selesai"
                              : "Sedang Berlangsung"}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.detailText}>
                        Tanggal: {item.tanggal}
                      </Text>
                      <Text style={styles.detailText}>Jam: {item.jam}</Text>
                      <Text style={styles.detailText}>Ruang: {item.ruang}</Text>
                      <Text style={styles.detailText}>
                        Dosen: {item.nama_dosen}
                      </Text>
                      <Text style={styles.detailText}>Kelas: {item.kelas}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* 🔹 Tombol Scan Ulang SELALU tampil */}
            <TouchableOpacity
              style={[styles.button, { marginTop: 20, marginBottom: 40 }]}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.buttonText}>🔄 Scan Ulang</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  cameraOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scannerBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#00a3eeff",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  overlayText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  matkul: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E90FF",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 15,
    color: "#333",
    marginVertical: 1,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeActive: {
    backgroundColor: "#1E90FF",
  },
  badgeDone: {
    backgroundColor: "#2E8B57",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
