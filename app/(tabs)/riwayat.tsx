import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Riwayat() {
  const [showMenu, setShowMenu] = useState(false);
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useFocusEffect(
    useCallback(() => {
      playAnimations();
    }, [playAnimations])
  );

  const getDataRiwayat = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert("Token tidak ditemukan", "Silakan login ulang.");
        setLoading(false);
        router.replace("/");
        return;
      }

      const response = await api.get("/presensi/riwayat?limit=10", {
        headers: {
          XAuthorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.riwayat) {
        setRiwayat(response.data.riwayat);
      } else {
        Alert.alert(
          "Gagal",
          response.data?.message || "Riwayat tidak ditemukan"
        );
      }
    } catch (error: any) {
      console.error(
        "Error GetRiwayatData : ",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataRiwayat();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logout", "Berhasil logout!");
    setShowMenu(false);
    router.replace("/");
  };

  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return "Alpha";
      case 2:
        return "Hadir";
      case 3:
        return "Ijin";
      case 4:
        return "Sakit";
      case 5:
        return "Dispensasi";
      default:
        return "Tidak diketahui";
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header animasi */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerAnim }],
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Riwayat Presensi</Text>

          <Pressable
            onPress={() => setShowMenu(!showMenu)}
            style={styles.menuButton}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </Pressable>
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

      {/* 🔹 Konten animasi */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: listAnim,
            transform: [
              {
                translateY: listAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {loading ? (
          // ✅ Loading di tengah layar penuh
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8, color: "#555" }}>Memuat data...</Text>
          </View>
        ) : (
          <FlatList
            data={riwayat}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <Animated.View
                style={{
                  opacity: listAnim,
                  transform: [
                    {
                      translateY: listAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20 * (index + 1), 0],
                      }),
                    },
                  ],
                }}
              >
                <View style={styles.card}>
                  {/* Badge Status */}
                  <View
                    style={[
                      styles.badge,
                      item.status === 2
                        ? { backgroundColor: "#4CAF50" } // Hadir - hijau
                        : item.status === 3
                        ? { backgroundColor: "#FF9800" } // Ijin - oranye
                        : item.status === 4
                        ? { backgroundColor: "#2196F3" } // Sakit - biru
                        : item.status === 5
                        ? { backgroundColor: "#9C27B0" } // Dispensasi - ungu
                        : { backgroundColor: "#F44336" }, // Alpha - merah
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {getStatusLabel(item.status)}
                    </Text>
                  </View>

                  {/* Isi card */}
                  <Text style={styles.makul}>{item.makul}</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Pertemuan</Text>
                    <Text style={styles.value}>{item.pertemuan}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Tanggal</Text>
                    <Text style={styles.value}>{formatTanggal(item.tgl)}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Dosen</Text>
                    <Text style={styles.value}>{item.nmdosen}</Text>
                  </View>
                </View>
              </Animated.View>
            )}
            refreshing={loading}
            onRefresh={getDataRiwayat}
            contentContainerStyle={{ paddingBottom: 60 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: "#555" }}>
                Riwayat tidak tersedia.
              </Text>
            }
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF", paddingBottom: 60 },
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
    position: "relative",
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
    top: 85,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 8,
    zIndex: 9999,
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
  content: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  makul: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 10,
    paddingRight: 80,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  label: {
    color: "#444",
    fontWeight: "600",
    width: 90,
  },
  value: {
    flex: 1,
    textAlign: "left",
    color: "#333",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  // ✅ Style tambahan: loading di tengah
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
