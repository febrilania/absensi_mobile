import { refreshToken } from "@/src/api/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true; // mencegah navigasi dobel

    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const role = await SecureStore.getItemAsync("role");
        const expiresAt = await SecureStore.getItemAsync("expires_at");

        if (!token || !role || !expiresAt) {
          if (isMounted) router.replace("/login");
          return;
        }

        const now = new Date();
        const exp = new Date(expiresAt);

        if (exp <= now) {
          console.log("⚠️ Token expired, mencoba refresh...");
          const newToken = await refreshToken();
          if (!newToken) {
            if (isMounted) router.replace("/login");
            return;
          }
        }

        const validRoles = ["um_dosen", "um_mahasiswa", "um_karyawan"];
        if (!validRoles.includes(role)) {
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("expires_at");
          await SecureStore.deleteItemAsync("role");
          if (isMounted) router.replace("/login");
          return;
        }

        if (isMounted) {
          if (role === "um_dosen") {
            router.replace("/(tabsDosen)/beranda");
          } else if (role === "um_mahasiswa") {
            router.replace("/(tabs)/beranda");
          } else {
            router.replace("/(tabsKaryawan)/beranda");
          }
        }
      } catch (err) {
        console.error("❌ Gagal memeriksa status login:", err);
        if (isMounted) router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    checkLoginStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  if (checking) {
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
