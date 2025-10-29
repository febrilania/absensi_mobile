import Header from "@/components/header";
import WelcomeCard from "@/components/welcomeCard";
import { useUser } from "@/hooks/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  { key: "uts", label: "UTS", icon: "school-outline" },
  { key: "uas", label: "UAS", icon: "reader-outline" },
  { key: "mengajar", label: "Jadwal Mengajar", icon: "calendar-outline" },
];

export default function BerandaDosen() {
  const router = useRouter();
  const { user, role } = useUser();

  const handleNavigate = (item: (typeof MENU_ITEMS)[0]) => {
    if (item.key === "uts") router.push("/pages/dosen/uts");
    else if (item.key === "uas") router.push("/pages/dosen/uas");
    else if (item.key === "mengajar") router.push("/pages/dosen/mengajar");
  };

  return (
    <>
      <Header title="Beranda" />
      <View style={styles.container}>
        {/* 🔹 Gunakan WelcomeCard yang reusable */}
        <WelcomeCard nama={user?.nama} role={role} foto={user?.foto} />

        <View style={styles.content}>
          {MENU_ITEMS.map((item) => (
            <View key={item.key} style={styles.card}>
              <TouchableOpacity
                style={styles.cardInner}
                onPress={() => handleNavigate(item)}
                activeOpacity={0.8}
              >
                <Ionicons name={item.icon as any} size={30} color="#1E90FF" />
                <Text style={styles.cardTitle}>{item.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </>
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
  cardInner: { alignItems: "center", justifyContent: "center" },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
