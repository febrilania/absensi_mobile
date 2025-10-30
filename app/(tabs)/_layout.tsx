import { storage } from "@/src/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Tabs, useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 🔐 Cek login state setiap kali layout dimuat

  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        try {
          const token = await storage.getItem("token");
          if (!token) {
            router.dismissAll();
            router.replace("/login");
          }
        } catch (error) {
          console.error("Gagal memeriksa autentikasi:", error);
          router.dismissAll();
          router.replace("/login");
        }
      };

      checkAuth();
    }, [])
  );

  return (
    <Tabs
      key="tabs"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
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
