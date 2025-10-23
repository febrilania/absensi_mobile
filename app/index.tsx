import { refreshToken } from "@/src/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, LogBox, View } from "react-native";

LogBox.ignoreLogs(["The action 'POP_TO_TOP' was not handled by any navigator"]);

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkLoginStatus = async () => {
      try {
        let token = await SecureStore.getItemAsync("token");
        let appRole = await SecureStore.getItemAsync("app_role");
        let expiresAt = await SecureStore.getItemAsync("expires_at");

        // backup dari AsyncStorage kalau kosong
        if (!token) token = await AsyncStorage.getItem("token");
        if (!appRole) appRole = await AsyncStorage.getItem("app_role");
        if (!expiresAt) expiresAt = await AsyncStorage.getItem("expires_at");

        if (!token || !appRole || !expiresAt) {
          if (isMounted) router.replace("/login");
          return;
        }

        const now = new Date();
        const exp = new Date(expiresAt);

        // refresh token kalau expired
        if (exp <= now) {
          const newToken = await refreshToken();
          if (!newToken) {
            if (isMounted) router.replace("/login");
            return;
          }
        }

        // simpan ulang ke dua storage
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("app_role", appRole);
        await SecureStore.setItemAsync("expires_at", expiresAt);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("app_role", appRole);
        await AsyncStorage.setItem("expires_at", expiresAt);

        // arahkan sesuai kategori role
        setTimeout(() => {
          if (!isMounted) return;

          router.dismissAll(); // 🧹 bersihkan stack

          if (appRole === "dosen") {
            router.replace("/(tabsDosen)/beranda");
          } else if (appRole === "mahasiswa") {
            router.replace("/(tabs)/beranda");
          } else if (appRole === "karyawan") {
            router.replace("/(tabsKaryawan)/beranda");
          } else {
            router.replace("/login");
          }
        }, 200);
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
