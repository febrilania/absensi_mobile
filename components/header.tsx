import { confirmDialog, showAlert } from "@/src/utils/alert"; // ✅ import
import { storage } from "@/src/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Header({
  title = "Halaman",
  showBack = false,
  onBack,
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  // 🔹 Logout universal
  const handleLogout = async () => {
    const confirm = await confirmDialog("Konfirmasi", "Yakin ingin logout?");
    if (!confirm) return;

    try {
      await storage.deleteItem("token");
      await storage.deleteItem("expires_at");
      await storage.deleteItem("role");
      await storage.deleteItem("app_role");
      await AsyncStorage.multiRemove([
        "token",
        "expires_at",
        "role",
        "app_role",
      ]);

      showAlert("Logout", "Berhasil logout!");
      router.replace("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
      showAlert("Error", "Gagal logout, coba lagi.");
    }
  };

  const handleGoBack = () => {
    if (onBack) onBack();
    else {
      try {
        router.back();
      } catch {
        router.replace("/beranda");
      }
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {showBack ? (
          <Pressable onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}

        <Text style={styles.title}>{title}</Text>

        <Pressable
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </Pressable>
      </View>

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
