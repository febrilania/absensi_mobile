import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function UTS() {
  const [loading, setLoading] = useState(false);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [filteredJadwal, setFilteredJadwal] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedHari, setSelectedHari] = useState<number | null>(null);
  const router = useRouter();

  // 🔹 Ambil jadwal setiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      fetchJadwal(1); // 1 untuk UTS
    }, [])
  );

  const fetchJadwal = async (ujian: number) => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang");
        router.replace("/");
        return;
      }

      const response = await api.post(
        "/jadwalujian",
        { ujian },
        { headers: { XAuthorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const data = response.data.data || [];

        // 🔹 Urutkan berdasarkan tanggal dan jam
        const sorted = [...data].sort((a, b) => {
          const dateA = new Date(`${a.tanggal} ${a.jam}`);
          const dateB = new Date(`${b.tanggal} ${b.jam}`);
          return dateA.getTime() - dateB.getTime();
        });

        setJadwal(sorted);
      } else {
        Alert.alert("Error", response.data.message || "Gagal mengambil data");
      }
    } catch (error: any) {
      console.error("Error get jadwal:", error.response?.data || error);
      Alert.alert("Error", "Terjadi kesalahan memuat jadwal.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Konfirmasi", "Yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya, Logout",
        onPress: async () => {
          try {
            // 🔥 Hapus dari SecureStore
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("expires_at");
            await SecureStore.deleteItemAsync("role");

            // 🔥 Hapus juga dari AsyncStorage
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("expires_at");
            await AsyncStorage.removeItem("role");

            Alert.alert("Logout", "Berhasil logout!");
            router.replace("/login");
          } catch (error) {
            console.error("Gagal logout:", error);
            Alert.alert("Error", "Gagal logout, coba lagi.");
          }
        },
      },
    ]);
  };

  const formatTanggalIndo = (tanggal: string) => {
    try {
      const date = new Date(tanggal);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("id-ID", options).format(date);
    } catch (e) {
      return tanggal;
    }
  };

  const filterByHari = (hari: number) => {
    setSelectedHari(hari);
    const filtered = jadwal.filter((item) => item.hari == hari);
    setFilteredJadwal(filtered);
  };

  const namaHari: any = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    6: "Sabtu",
    7: "Ahad",
  };

  const barisHari = [
    [6, 7, 1],
    [2, 3, 4],
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* 🔹 Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.title}>📘 Jadwal UTS</Text>

            <TouchableOpacity
              onPress={() => setShowMenu(!showMenu)}
              style={styles.menuButton}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {showMenu && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.dropdownItem}
              >
                <Ionicons name="log-out-outline" size={18} color="#1E90FF" />
                <Text style={styles.dropdownText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 🔹 Filter Hari */}
        <Text style={styles.subTitle}>Pilih Hari Ujian</Text>
        <View style={styles.filterWrapper}>
          {barisHari.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => filterByHari(num)}
                  style={[
                    styles.filterButton,
                    selectedHari === num && styles.filterButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedHari === num && styles.filterTextActive,
                    ]}
                  >
                    {namaHari[num]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* 🔹 Spinner Loading */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8 }}>Memuat jadwal UTS...</Text>
          </View>
        )}

        {/* 🔹 Konten */}
        {!loading && (
          <>
            {selectedHari === null ? (
              <View style={styles.center}>
                <Text style={{ color: "#555" }}>
                  Silakan pilih hari terlebih dahulu.
                </Text>
              </View>
            ) : filteredJadwal.length === 0 ? (
              <View style={styles.center}>
                <Text style={{ color: "#555" }}>
                  Tidak ada jadwal di hari ini.
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredJadwal}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Text style={styles.matkul}>{item.mata_kuliah}</Text>

                    <View style={styles.rowData}>
                      <Text style={styles.label}>Tanggal</Text>
                      <Text style={styles.value}>
                        {formatTanggalIndo(item.tanggal)}
                      </Text>
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
                    <View style={styles.rowData}>
                      <Text style={styles.label}>Dosen</Text>
                      <Text style={styles.value}>{item.nama_dosen}</Text>
                    </View>
                  </View>
                )}
              />
            )}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF" },
  header: {
    backgroundColor: "#1E90FF",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 99,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "white" },
  backButton: { paddingRight: 10 },
  menuButton: { paddingLeft: 10 },
  dropdown: {
    position: "absolute",
    right: 15,
    top: 85,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "600",
  },
  subTitle: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 10,
  },
  filterWrapper: { marginTop: 8, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "center", marginVertical: 4 },
  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#1E90FF",
    minWidth: 90,
    alignItems: "center",
  },
  filterButtonActive: { backgroundColor: "#1E90FF" },
  filterText: { color: "#1E90FF", fontWeight: "500" },
  filterTextActive: { color: "#fff" },
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
  label: { fontWeight: "500", color: "#555", width: "25%" },
  value: { color: "#333", width: "75%", textAlign: "left" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
