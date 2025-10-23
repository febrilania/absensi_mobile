import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // animasi
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
      fetchRiwayat();
    }, [playAnimations])
  );

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang");
        router.replace("/");
        return;
      }

      const response = await api.get("/riwayatmengawas", {
        headers: { XAuthorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRiwayat(response.data.data || []);
      } else {
        Alert.alert(
          "Gagal",
          response.data.message || "Tidak ada data riwayat."
        );
      }
    } catch (error: any) {
      console.error("Error riwayat:", error.response?.data || error);
      Alert.alert("Error", "Gagal memuat data riwayat.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRiwayat();
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

            // 🔥 Hapus juga dari AsyncStorage (biar gak auto-restore)
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

  // 🔹 Hari & Tanggal dalam Bahasa Indonesia
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 🔹 HEADER ANIMASI */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerAnim }],
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Riwayat Mengawas</Text>

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

      {/* 🔹 LIST ANIMASI */}
      <Animated.View
        style={{
          flex: 1,
          opacity: listAnim,
          transform: [
            {
              translateY: listAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8, color: "#555" }}>Memuat data...</Text>
          </View>
        ) : (
          <FlatList
            data={riwayat}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              padding: 16,
              paddingBottom: insets.bottom + 90, // ✅ Tambahan biar gak nabrak tabs
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={{ color: "#555", marginTop: 30 }}>
                  Belum ada riwayat mengawas.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.matkul}>{item.mata_kuliah}</Text>
                  <View style={[styles.badge, styles.badgeDone]}>
                    <Text style={styles.badgeText}>
                      {item.status_ujian || "Selesai"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.labelMateri}>{item.materi}</Text>

                <View style={styles.line} />

                <Text style={styles.infoText}>
                  📅 {formatTanggal(item.tanggal)}
                </Text>
                <Text style={styles.infoText}>🕐 {item.jam}</Text>
                <Text style={styles.infoText}>🏫 Ruang: {item.ruang}</Text>
                <Text style={styles.infoText}>
                  🎓 {item.kelas} ({item.prodi})
                </Text>
                <Text style={styles.infoText}>👨‍🏫 {item.nama_dosen}</Text>
                <Text style={styles.infoText}>📘 {item.sifat}</Text>

                <View style={styles.statBox}>
                  <Text style={styles.statText}>
                    👨‍🎓 Hadir: {item.hadir}/{item.jumlah_mhs}
                  </Text>
                  <Text style={styles.statText}>
                    🚫 Tidak Hadir: {item.tidak_hadir}
                  </Text>
                </View>

                {item.catatan ? (
                  <View style={styles.catatanBox}>
                    <Text style={styles.catatanLabel}>📝 Catatan:</Text>
                    <Text style={styles.catatanText}>{item.catatan}</Text>
                  </View>
                ) : null}

                <View style={styles.footer}>
                  <Ionicons name="calendar-sharp" size={14} color="#555" />
                  <Text style={styles.footerText}>
                    Presensi: {formatTanggal(item.tgl_presensi)}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E8F1FF" },
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matkul: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E90FF",
    flexShrink: 1,
    marginRight: 10,
  },
  labelMateri: {
    color: "#555",
    fontSize: 11,
    marginTop: 2,
    fontStyle: "italic",
  },
  line: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  infoText: {
    color: "#333",
    fontSize: 14,
    marginBottom: 2,
  },
  statBox: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  statText: {
    color: "#1E90FF",
    fontWeight: "600",
    fontSize: 13,
  },
  catatanBox: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#1E90FF",
  },
  catatanLabel: {
    fontWeight: "600",
    color: "#1E90FF",
    marginBottom: 4,
  },
  catatanText: {
    color: "#444",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  footerText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 4,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeDone: {
    backgroundColor: "#2E8B57",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
