import Header from "@/components/header";
import MenuCard from "@/components/menuCard";
import WelcomeCard from "@/components/welcomeCard";
import { useUser } from "@/hooks/user";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

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
  const { user, role } = useUser();

  const handleNavigate = (key: string) => {
    if (key === "jadwal") router.push("/pages/mahasiswa/jadwal");
  };

  return (
    <View style={styles.container}>
      <Header title="Beranda" />

      {/* 🔹 Kartu selamat datang */}
      <WelcomeCard nama={user?.nama} role={role} foto={user?.foto} />

      {/* 🔹 Menu grid */}
      <View style={styles.content}>
        {MENU_ITEMS.map((item) => (
          <MenuCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            onPress={() => handleNavigate(item.key)}
            disabled={!item.available}
            comingSoon={!item.available}
          />
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
});
