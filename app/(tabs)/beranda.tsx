import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MENU_ITEMS = [
  {
    key: "jadwal",
    label: "Jadwal Kuliah",
    icon: "calendar-outline",
    available: true,
  },
  {
    key: "matkul",
    label: "Mata Kuliah",
    icon: "book-outline",
    available: false,
  },
  { key: "krs", label: "KRS", icon: "clipboard-outline", available: false },
  { key: "pkl", label: "PKL", icon: "construct-outline", available: false },
  { key: "kkn", label: "KKN", icon: "people-outline", available: false },
];

export default function Beranda() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // 🔹 Animasi
  const headerAnim = useRef(new Animated.Value(-150)).current;
  const cardsAnim = useRef(MENU_ITEMS.map(() => new Animated.Value(0))).current;
  const welcomeAnim = useRef(new Animated.Value(0)).current;

  const playAnimations = useCallback(() => {
    headerAnim.setValue(-150);
    cardsAnim.forEach((a) => a.setValue(0));
    welcomeAnim.setValue(0);

    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(welcomeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();

    const animations = cardsAnim.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 200 * i + 300,
        useNativeDriver: true,
      })
    );
    Animated.stagger(150, animations).start();
  }, [headerAnim, cardsAnim, welcomeAnim]);

  useFocusEffect(
    useCallback(() => {
      playAnimations();
      getUserData();
    }, [playAnimations])
  );

  const getUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await api.get("/me", {
        headers: { XAuthorization: `Bearer ${token}` },
      });

      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (e) {
      console.error("Gagal ambil user:", e);
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

  const handleNavigate = (item: (typeof MENU_ITEMS)[0]) => {
    if (item.available) {
      if (item.key === "jadwal") router.push("/mahasiswa/jadwal");
    } else {
      Alert.alert("Coming Soon", "Menu ini masih dalam pengembangan.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerAnim }] }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Beranda</Text>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.menuButton}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Dropdown menu */}
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

      {/* 🔹 Card Selamat Datang */}
      <Animated.View
        style={[
          styles.welcomeCard,
          {
            opacity: welcomeAnim,
            transform: [
              {
                translateY: welcomeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Foto user atau icon default */}
        {user?.foto ? (
          <Image
            source={{ uri: user.foto }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person-circle-outline" size={60} color="#1E90FF" />
        )}

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.welcomeText}>
            👋 Selamat datang,{" "}
            <Text style={{ fontWeight: "bold" }}>
              {user?.nama || "Mahasiswa"}
            </Text>
          </Text>
          <Text style={styles.roleText}>Anda login sebagai Mahasiswa</Text>
        </View>
      </Animated.View>

      {/* 🔹 Menu */}
      <View style={styles.content}>
        {MENU_ITEMS.map((item, index) => (
          <Animated.View
            key={item.key}
            style={[
              styles.card,
              {
                opacity: cardsAnim[index],
                backgroundColor: item.available ? "#fff" : "#ccc",
                transform: [
                  {
                    translateY: cardsAnim[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.cardInner}
              onPress={() => handleNavigate(item)}
              activeOpacity={item.available ? 0.7 : 1}
            >
              <Ionicons
                name={item.icon as any}
                size={28}
                color={item.available ? "#1E90FF" : "#555"}
              />
              <Text
                style={[
                  styles.cardTitle,
                  { color: item.available ? "#333" : "#555" },
                ]}
              >
                {item.label}
              </Text>

              {!item.available && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>Coming Soon</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

// 🔹 Styles
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
  welcomeCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#1E90FF",
    backgroundColor: "#eee",
  },
  welcomeText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: "#1E90FF",
    fontWeight: "600",
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    justifyContent: "center",
  },
  cardInner: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  cardTitle: { marginTop: 8, fontSize: 16, fontWeight: "600" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: { color: "#fff", fontWeight: "600" },
});
