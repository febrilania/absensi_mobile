import api from "@/src/api/api";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Code() {
  const [visible, setVisible] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [tanggal, setTanggal] = useState("");
  const [qr, setQr] = useState("");
  const router = useRouter();

  // === Tampilkan modal saat halaman difokuskan ===
  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      // jika sudah ada QR sebelumnya, auto-refresh
      if (qr) {
        fetchPengawas(qr);
      }
      return () => setVisible(false);
    }, [qr])
  );

  // === Ambil data pengawas ===
  const fetchPengawas = async (kode: string) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const response = await api.post(
        "/pengawas",
        { qr_token: kode },
        {
          headers: {
            XAuthorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setTanggal(response.data.tanggal);
        setQr(response.data.qr || kode);
        setJadwal(response.data.data || []);
      } else {
        Alert.alert(
          "Gagal",
          response.data.message || "Tidak ada data ditemukan."
        );
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

  // === Submit kode manual ===
  const handleSubmit = async () => {
    if (!manualCode) {
      Alert.alert("Error", "Kode tidak boleh kosong");
      return;
    }
    setQr(manualCode);
    await fetchPengawas(manualCode);
  };

  // === Klik card jadwal ===
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
        { id: item.id, qr_token: qr },
        {
          headers: {
            "Content-Type": "application/json",
            XAuthorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        response.data.status_ujian = item.status_ujian;
        router.push({
          pathname: "/karyawan/mengawas-detail",
          params: { data: JSON.stringify(response.data) },
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

  // === Batal & keluar modal ===
  const handleCancel = () => {
    setManualCode("");
    setJadwal([]);
    setTanggal("");
    setQr("");
    setVisible(false);
    router.replace("/beranda");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Ujian Selesai":
        return { backgroundColor: "#4CAF50" };
      case "Sedang Berlangsung":
        return { backgroundColor: "#1E90FF" };
      default:
        return { backgroundColor: "#888" };
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Modal
          visible={visible}
          transparent={false}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.container}>
            <Text style={styles.title}>📷 Scan / Input Kode Pengawas</Text>

            <TextInput
              style={styles.input}
              placeholder="Masukkan kode QR"
              placeholderTextColor="#999"
              value={manualCode}
              onChangeText={setManualCode}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Mengambil data..." : "Kirim"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#aaa", marginTop: 8 }]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>

            {/* LIST JADWAL */}
            <View style={{ marginTop: 20, flex: 1 }}>
              {jadwal.length === 0 ? (
                <View style={styles.center}>
                  <Text style={{ color: "#555", marginTop: 20 }}>
                    Tidak ada jadwal pengawas hari ini.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={jadwal}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleCardPress(item)}>
                      <View style={styles.card}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.matkul}>{item.mata_kuliah}</Text>
                          {item.status_ujian && (
                            <View
                              style={[
                                styles.badge,
                                getStatusStyle(item.status_ujian),
                              ]}
                            >
                              <Text style={styles.badgeText}>
                                {item.status_ujian}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.rowData}>
                          <Text style={styles.label}>Tanggal</Text>
                          <Text style={styles.value}>{item.tanggal}</Text>
                        </View>
                        <View style={styles.rowData}>
                          <Text style={styles.label}>Jam</Text>
                          <Text style={styles.value}>{item.jam}</Text>
                        </View>
                        <View style={styles.rowData}>
                          <Text style={styles.label}>Ruang</Text>
                          <Text style={styles.value}>{item.ruang}</Text>
                        </View>
                        <View style={styles.rowData}>
                          <Text style={styles.label}>Kelas</Text>
                          <Text style={styles.value}>{item.kelas}</Text>
                        </View>
                        <View style={styles.rowData}>
                          <Text style={styles.label}>Prodi</Text>
                          <Text style={styles.value}>{item.prodi}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F1FF",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  center: { justifyContent: "center", alignItems: "center" },
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
    marginBottom: 8,
  },
  rowData: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontWeight: "500",
    color: "#555",
    width: "25%",
  },
  value: {
    color: "#333",
    width: "75%",
    textAlign: "left",
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
