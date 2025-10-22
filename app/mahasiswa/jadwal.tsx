import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Jadwal() {
  const [showMenu, setShowMenu] = useState(false);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert("Token tidak ditemukan", "Silakan login ulang.");
        router.replace("/");
        return;
      }

      const response = await api.get("/jadwal", {
        headers: {
          XAuthorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.success) {
        setJadwal(response.data.data);
      } else {
        Alert.alert("Gagal", "Tidak dapat memuat data jadwal.");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat memuat jadwal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logout", "Berhasil logout!");
    setShowMenu(false);
    router.replace("/");
  };

  const days = [
    { id: "6", label: "Sabtu" },
    { id: "7", label: "Ahad" },
    { id: "1", label: "Senin" },
    { id: "2", label: "Selasa" },
    { id: "3", label: "Rabu" },
    { id: "4", label: "Kamis" },
  ];

  const filteredJadwal = selectedDay
    ? jadwal.filter((item) => item.hari === selectedDay)
    : [];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* 🔹 Header */}
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: headerAnim }],
            },
          ]}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.title}>Jadwal Kuliah</Text>

            <Pressable
              onPress={() => setShowMenu(!showMenu)}
              style={styles.menuButton}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </Pressable>
          </View>

          {/* 🔹 Dropdown Logout */}
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

        {/* 🔹 Tombol Hari */}
        <View style={styles.daysWrapper}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dayButton,
                selectedDay === day.id && styles.dayButtonActive,
              ]}
              onPress={() => setSelectedDay(day.id)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDay === day.id && styles.dayTextActive,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔹 Daftar Jadwal */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : filteredJadwal.length > 0 ? (
            filteredJadwal.map((item, index) => (
              <TouchableOpacity
                key={item.id ?? index} // fallback ke index jika id tidak ada
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/mahasiswa/pertemuan",
                    params: {
                      jadwal: JSON.stringify(item),
                      kd_ajar: item.kd_ajar,
                    },
                  })
                }
              >
                {/* 🔹 Badge Sifat Kuliah */}
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.kuliah}</Text>
                </View>

                <View style={styles.cardHeader}>
                  <Ionicons name="book-outline" size={22} color="#1E90FF" />
                  <Text style={styles.ket}>{item.makul}</Text>
                </View>

                {/* 🔹 Info Jadwal */}
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Kode MK</Text>
                  <Text style={styles.value}>{item.kd_makul}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Dosen</Text>
                  <Text style={styles.value}>{item.nmdosen}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>No HP</Text>
                  <Text style={styles.value}>{item.wa_dosen}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Kelas</Text>
                  <Text style={styles.value}>{item.nm_kelas}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Jam</Text>
                  <Text style={styles.value}>
                    {item.jam_d} - {item.jam_s}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Ruang</Text>
                  <Text style={styles.value}>{item.ruang}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : selectedDay ? (
            <Text style={styles.noData}>Tidak ada jadwal hari ini</Text>
          ) : (
            <Text style={styles.noData}>Pilih hari terlebih dahulu</Text>
          )}
        </ScrollView>
      </View>
    </>
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
    zIndex: 999,
    position: "relative",
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
  daysWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#E8F1FF",
  },
  dayButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 6,
    width: "28%",
    alignItems: "center",
  },
  dayButtonActive: { backgroundColor: "#1E90FF" },
  dayText: { color: "#333", fontWeight: "500" },
  dayTextActive: { color: "#fff", fontWeight: "bold" },
  scrollContent: { padding: 12 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  ket: { marginLeft: 6, fontSize: 16, fontWeight: "bold", color: "#1E90FF" },
  detail: { fontSize: 14, color: "#333", marginVertical: 2 },
  noData: { textAlign: "center", marginTop: 40, color: "#555", fontSize: 15 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    width: 100,
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
    backgroundColor: "#1E90FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
