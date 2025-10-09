import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MENU_ITEMS = [
  { key: "jadwal", label: "Jadwal Kuliah", icon: "calendar-outline" },
  { key: "matkul", label: "Mata Kuliah", icon: "book-outline" },
  { key: "krs", label: "KRS", icon: "clipboard-outline" },
  { key: "pkl", label: "PKL", icon: "construct-outline" },
  { key: "kkn", label: "KKN", icon: "people-outline" },
];

export default function Beranda() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  // 🔹 Animated value
  const headerAnim = useRef(new Animated.Value(-150)).current;
  const cardsAnim = useRef(MENU_ITEMS.map(() => new Animated.Value(0))).current;

  // 🔹 Fungsi untuk memutar ulang animasi
  const playAnimations = useCallback(() => {
    headerAnim.setValue(-150);
    cardsAnim.forEach((a) => a.setValue(0));

    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const animations = cardsAnim.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 0.5 * i,
        useNativeDriver: true,
      })
    );

    Animated.stagger(150, animations).start();
  }, [headerAnim, cardsAnim]);

  // 🔹 Jalankan animasi setiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      playAnimations();
    }, [playAnimations])
  );

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logout", "Berhasil logout!");
    setShowMenu(false);
    router.replace("/");
  };

  return (
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
        <Image
          source={require("../../assets/images/peradaban.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Menu Beranda</Text>
      </Animated.View>

      {/* 🔹 Tombol menu */}
      <Pressable
        onPress={() => setShowMenu(!showMenu)}
        style={styles.menuButton}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </Pressable>

      {/* 🔹 Dropdown */}
      {showMenu && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
            <Ionicons name="log-out-outline" size={18} color="#1E90FF" />
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🔹 Konten menu */}
      <View style={styles.content}>
        {MENU_ITEMS.map((item, index) => (
          <Animated.View
            key={item.key}
            style={[
              styles.card,
              {
                opacity: cardsAnim[index],
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
            <Ionicons name={item.icon as any} size={28} color="#1E90FF" />
            <Text style={styles.cardTitle}>{item.label}</Text>

            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Coming Soon</Text>
            </View>
          </Animated.View>
        ))}
      </View>
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
    zIndex: 5,
  },
  logo: { width: "40%", height: 90, marginBottom: 5 },
  title: { fontSize: 22, fontWeight: "bold", color: "white" },
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
    position: "relative",
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
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
  menuButton: {
    position: "absolute",
    right: 20,
    top: 70,
    padding: 5,
    zIndex: 15,
  },
});
