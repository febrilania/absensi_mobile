import Header from "@/components/header";
import WelcomeCard from "@/components/welcomeCard";
import { useUser } from "@/hooks/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  {
    key: "jadwal",
    label: "Jadwal Kuliah",
    icon: "calendar-outline",
    available: true,
  },
  { key: "krs", label: "KRS", icon: "clipboard-outline", available: false },
  { key: "pkl", label: "PKL", icon: "construct-outline", available: false },
  { key: "kkn", label: "KKN", icon: "people-outline", available: false },
];

export default function BerandaMahasiswa() {
  const router = useRouter();
  const { user, role } = useUser(); // ✅ ambil role & user dari hook

  const handleNavigate = (item: (typeof MENU_ITEMS)[0]) => {
    if (item.available) {
      if (item.key === "jadwal") router.push("/pages/mahasiswa/jadwal");
    } else {
      Alert.alert("Coming Soon", "Menu ini masih dalam pengembangan.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Beranda" />

      {/* 🔹 Kartu Selamat Datang (pakai komponen reusable) */}
      <WelcomeCard
        nama={user?.nama}
        role={role}
        foto={user?.foto}
      />

      {/* 🔹 Menu Grid */}
      <View style={styles.content}>
        {MENU_ITEMS.map((item) => (
          <View
            key={item.key}
            style={[
              styles.card,
              { backgroundColor: item.available ? "#fff" : "#ccc" },
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
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF" },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
  },
  card: {
    width: "47%",
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
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
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
  overlayText: {
    color: "#fff",
    fontWeight: "600",
  },
});
