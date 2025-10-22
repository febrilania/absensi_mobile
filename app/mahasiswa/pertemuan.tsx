import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Pertemuan() {
  const { kd_ajar, jadwal } = useLocalSearchParams();
  const [pertemuan, setPertemuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const headerAnim = useRef(new Animated.Value(-150)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  const playAnimations = useCallback(() => {
    headerAnim.setValue(-150);
    listAnim.setValue(0);

    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(listAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [headerAnim, listAnim]);

  useEffect(() => {
    playAnimations();
  }, [playAnimations]);

  const fetchPertemuan = async () => {
    let kode = Array.isArray(kd_ajar) ? kd_ajar[0] : kd_ajar;
    if (!kode) return;

    try {
      if (!refreshing) setLoading(true);

      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Token tidak ditemukan", "Silakan login ulang.");
        router.replace("/");
        return;
      }

      const response = await api.get(`/pertemuan?kode=${kode}`, {
        headers: {
          XAuthorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setPertemuan(data);
      } else {
        Alert.alert("Gagal", "Tidak dapat memuat data pertemuan.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Terjadi kesalahan saat memuat pertemuan.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPertemuan();
  }, [kd_ajar]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logout", "Berhasil logout!");
    setShowMenu(false);
    router.replace("/");
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPertemuan();
  }, [kd_ajar]);

  const formatTanggal = (tgl: string) => {
    const date = new Date(tgl);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "HADIR":
        return "#28A745";
      case "ALPHA":
        return "#DC3545";
      default:
        return "#FFC107";
    }
  };

  let dataJadwal = null;
  if (jadwal) {
    const jadwalStr = Array.isArray(jadwal) ? jadwal[0] : jadwal;
    try {
      dataJadwal = JSON.parse(jadwalStr);
    } catch (err) {
      console.log("Error parsing jadwal:", err);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        {/* 🔹 Header */}
        <Animated.View
          style={[styles.header, { transform: [{ translateY: headerAnim }] }]}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.title}>Pertemuan</Text>

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
        </Animated.View>

        <ScrollView
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {dataJadwal && (
            <View style={styles.jadwalInfoCard}>
              <Text style={styles.jadwalMakul}>{dataJadwal.makul}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Dosen</Text>
                <Text style={styles.value}>{dataJadwal.nmdosen}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Kelas</Text>
                <Text style={styles.value}>{dataJadwal.nm_kelas}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Jam</Text>
                <Text style={styles.value}>
                  {dataJadwal.jam_d} - {dataJadwal.jam_s}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Ruang</Text>
                <Text style={styles.value}>{dataJadwal.ruang}</Text>
              </View>
            </View>
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : pertemuan.length > 0 ? (
            pertemuan.map((item) => (
              <View
                key={item.id_token ?? Math.random().toString()}
                style={styles.card}
              >
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColor(item.status_presensi) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.status_presensi ?? "-"}
                  </Text>
                </View>

                <View style={styles.cardHeader}>
                  <Ionicons name="calendar-outline" size={22} color="#1E90FF" />
                  <Text style={styles.ket}>Pertemuan {item.pertemuan}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Tanggal</Text>
                  <Text style={styles.value}>{formatTanggal(item.tgl)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Waktu</Text>
                  <Text style={styles.value}>{item.waktu?.split(" ")[1]}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Materi</Text>
                  <Text style={styles.value}>{item.materi ?? "-"}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Link</Text>
                  {item.link ? (
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={() => {
                        import("react-native").then(({ Linking }) => {
                          Linking.openURL(item.link);
                        });
                      }}
                    >
                      <Text style={styles.linkText}>Zoom Meeting</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.value}>-</Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              Tidak ada data pertemuan
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
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
    zIndex: 999,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "white" },
  menuButton: { padding: 5 },
  dropdown: {
    position: "absolute",
    right: 15,
    top: 55,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 8,
    zIndex: 9999,
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
  jadwalInfoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E90FF",
  },
  jadwalMakul: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  ket: { marginLeft: 6, fontSize: 16, fontWeight: "bold", color: "#1E90FF" },
  infoRow: { flexDirection: "row", marginVertical: 2 },
  label: { width: 80, fontWeight: "600", color: "#555" },
  value: { flex: 1, color: "#333" },
  linkButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  linkText: { color: "white", fontWeight: "600" },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 10,
  },
  statusText: { color: "white", fontWeight: "bold", fontSize: 12 },
});
