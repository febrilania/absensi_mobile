import api, { saveToken } from "@/src/api/api";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Peringatan", "Username dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/login",
        { username: username.trim(), password: password.trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response dari server:", response.data);

      const token = response.data?.token;
      const role = response.data?.user?.role;
      const expiresIn = response.data?.expires_in || 3600; // default 1 jam

      if (token && role) {
        // ✅ Simpan token dan waktu kedaluwarsa via helper saveToken
        await saveToken(token, expiresIn);
        await SecureStore.setItemAsync("role", role);

        Alert.alert("Berhasil", "Login berhasil!");

        // ✅ Arahkan ke halaman sesuai role
        if (role === "um_dosen") {
          router.replace("/(tabsDosen)/beranda");
        } else if (role === "um_mahasiswa") {
          router.replace("/(tabs)/beranda");
        } else {
          router.replace("/(tabsKaryawan)/beranda");
        }
      } else {
        Alert.alert("Gagal", "Token atau role tidak ditemukan dari server.");
      }
    } catch (error: any) {
      console.error("Error login:", error);
      Alert.alert(
        "Login Gagal",
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan jaringan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1E90FF", "#a8d5ffff"]}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.overlay}>
            <View style={styles.card}>
              <Image
                source={require("../assets/images/peradaban.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Selamat Datang 👋</Text>
              <Text style={styles.subtitle}>
                Masuk dengan akun SSO Universitas Peradaban
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#000"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#000"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.footerText}>
                Gunakan akun sim.peradaban.ac.id anda
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#1E90FF" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: "75%",
    height: 90,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#050505ff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#000000ff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#000",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    color: "#1d1d1dff",
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
  },
});
