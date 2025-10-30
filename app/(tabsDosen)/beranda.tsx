import Header from "@/components/header";
import MenuCard from "@/components/menuCard";
import WelcomeCard from "@/components/welcomeCard";
import { useUser } from "@/hooks/user";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const MENU_ITEMS = [
  { key: "uts", label: "UTS", icon: "school-outline" },
  { key: "uas", label: "UAS", icon: "reader-outline" },
  { key: "mengajar", label: "Jadwal Mengajar", icon: "calendar-outline" },
];

export default function BerandaDosen() {
  const router = useRouter();
  const { user, role } = useUser();

  const handleNavigate = (key: string) => {
    switch (key) {
      case "uts":
        router.push("/pages/dosen/uts");
        break;
      case "uas":
        router.push("/pages/dosen/uas");
        break;
      case "mengajar":
        router.push("/pages/dosen/mengajar");
        break;
    }
  };

  return (
    <>
      <Header title="Beranda" />
      <View style={styles.container}>
        {/* 🔹 Welcome Section */}
        <WelcomeCard nama={user?.nama} role={role} foto={user?.foto} />

        {/* 🔹 Menu Cards */}
        <View style={styles.content}>
          {MENU_ITEMS.map((item) => (
            <MenuCard
              key={item.key}
              label={item.label}
              icon={item.icon}
              onPress={() => handleNavigate(item.key)}
            />
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
});
