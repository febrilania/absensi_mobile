import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🧩 Definisi tipe untuk props
interface HeaderProps {
  title?: string; // Judul halaman (optional, default: "Halaman")
  showBack?: boolean; // Apakah tampil tombol kembali
  onBack?: () => void; // Fungsi ketika tombol back ditekan
}

export default function Header({
  title = "Halaman",
  showBack = false,
  onBack,
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const router = useRouter();

  // 🔹 Fungsi logout
  const handleLogout = async () => {
    Alert.alert("Konfirmasi", "Yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya, Logout",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("expires_at");
            await SecureStore.deleteItemAsync("role");
            await AsyncStorage.multiRemove(["token", "expires_at", "role"]);

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

  // 🔙 Fungsi back otomatis (kalau tidak ada halaman sebelumnya → ke beranda)
  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      try {
        router.back(); // balik ke halaman sebelumnya
      } catch {
        router.replace("/beranda"); // kalau gak bisa, balik ke beranda
      }
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {/* 🔙 Tombol Back (opsional) */}
        {showBack ? (
          <Pressable onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} /> // biar layout tetap seimbang
        )}

        {/* 🧾 Judul */}
        <Text style={styles.title}>{title}</Text>

        {/* ⚙️ Tombol menu (⋮) */}
        <Pressable
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </Pressable>
      </View>

      {/* 🔽 Dropdown menu logout */}
      {showMenu && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
            <Ionicons name="log-out-outline" size={18} color="#1E90FF" />
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1E90FF",
    paddingTop: 50,
    paddingBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 5,
    paddingHorizontal: 17,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    flex: 1,
  },
  menuButton: { paddingHorizontal: 15 },
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
});
