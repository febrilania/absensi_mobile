import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10,
          height: 70,
        },
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      {/* Tab kiri: Data */}
      <Tabs.Screen
        name="beranda"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="code"
        options={{
          title: "Code",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="key-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Tab tengah: Scan (tombol menonjol biru) */}
      <Tabs.Screen
        name="scan"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: "#1E90FF",
                width: 65,
                height: 65,
                borderRadius: 35,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 25,
                elevation: 6,
              }}
            >
              <Ionicons name="qr-code-outline" size={32} color="#fff" />
            </View>
          ),
        }}
      />

      {/* Tab kanan: Riwayat */}
      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
