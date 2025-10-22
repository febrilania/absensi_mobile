import { refreshToken } from "@/src/api/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    /**
     * ✅ Fungsi utama: cek apakah user sudah login
     * dan arahkan ke halaman sesuai role.
     */
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const role = await SecureStore.getItemAsync("role");
        const expiresAt = await SecureStore.getItemAsync("expires_at");

        // 🔍 Cek kalau token masih ada dan belum expired
        if (token && role && expiresAt) {
          const now = new Date();
          const exp = new Date(expiresAt);

          // Kalau token sudah expired → langsung refresh dulu
          if (exp <= now) {
            console.log("⚠️ Token kadaluarsa, coba refresh...");
            const newToken = await refreshToken();

            // Kalau gagal refresh → arahkan ke login
            if (!newToken) {
              router.replace("/login");
              return;
            }
          }

          // ✅ Arahkan sesuai role
          if (role === "um_dosen") {
            router.replace("/(tabsDosen)/beranda");
          } else if (role === "um_mahasiswa") {
            router.replace("/(tabs)/beranda");
          } else {
            router.replace("/(tabsKaryawan)/beranda");
          }
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("❌ Gagal memeriksa token:", error);
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    /**
     * 🔁 Fungsi untuk cek waktu token & refresh otomatis
     * setiap kali hampir habis (kurang dari 10 menit).
     */
    const checkTokenExpiry = async () => {
      try {
        const expiresAt = await SecureStore.getItemAsync("expires_at");
        if (!expiresAt) return;

        const diff = new Date(expiresAt).getTime() - Date.now();
        // Kalau sisa waktu < 10 menit → refresh token
        if (diff < 10 * 60 * 1000) {
          console.log("⏳ Token hampir kadaluarsa, refresh otomatis...");
          await refreshToken();
        }
      } catch (err) {
        console.error("Gagal memeriksa kedaluwarsa token:", err);
      }
    };

    // 🟢 Jalankan pengecekan login pertama kali
    checkLoginStatus();

    // 🔂 Cek token tiap 1 menit
    const interval = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * ⏳ Tampilkan indikator loading saat sedang cek login
   */
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
