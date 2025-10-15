import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          // Kalau token ada, langsung ke beranda
          router.replace("/(tabs)/beranda");
        } else {
          // Kalau belum login, arahkan ke halaman login
          router.replace("/login");
        }
      } catch (error) {
        console.error("Gagal memeriksa token:", error);
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (checking) {
    // Sementara tampilkan loading
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return null;
}
