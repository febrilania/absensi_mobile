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
    Image,
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
        <Image
          source={require("../../assets/images/peradaban.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Riwayat Presensi</Text>

        <Pressable
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </Pressable>

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
          <ActivityIndicator size="large" color="#1E90FF" />
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
                  <Text style={styles.makul}>{item.makul}</Text>
                  <Text>Pertemuan: {item.pertemuan}</Text>
                  <Text>Tanggal: {formatTanggal(item.tgl)}</Text>
                  <Text>Dosen: {item.nmdosen}</Text>
                  <Text>Status: {getStatusLabel(item.status)}</Text>
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
  container: { flex: 1, backgroundColor: "#E8F1FF" },
  header: {
    backgroundColor: "#1E90FF",
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  logo: { width: "40%", height: 90, marginBottom: 5 },
  title: { fontSize: 22, fontWeight: "bold", color: "white" },
  menuButton: { position: "absolute", right: 20, top: 70, padding: 5 },
  dropdown: {
    position: "absolute",
    right: 15,
    top: 100,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
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
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  makul: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
