import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserData = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert("Token tidak ditemukan", "Silakan login ulang.");
        setLoading(false);
        router.replace("/");
        return;
      }

      console.log("Token terkirim ke /me:", token);

      const response = await api.get(
        "/me",
        {
          headers: {
            XAuthorization: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respons dari /me:", response.data);

      
      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        Alert.alert(
          "Gagal",
          response.data?.message || "Data user tidak ditemukan."
        );
      }
    } catch (error: any) {
      console.error(
        "Error getUserData:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logout", "Berhasil logout!");
    setShowMenu(false);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/peradaban.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Data Pengguna</Text>

        
        <Pressable
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </Pressable>

        
        {showMenu && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.dropdownItem}
            >
              <Ionicons name="log-out-outline" size={18} color="#1E90FF" />
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : user ? (
          <>
            <Text style={styles.label}>Nama Lengkap</Text>
            <Text style={styles.value}>{user.nama}</Text>

            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{user.username}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>No HP</Text>
            <Text style={styles.value}>{user.hp}</Text>
          </>
        ) : (
          <Text style={{ textAlign: "center", color: "#555" }}>
            Data tidak tersedia.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF" },
  header: {
    backgroundColor: "#1E90FF",
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  logo: { width: "40%", height: 90, marginBottom: 5 },
  title: { fontSize: 22, fontWeight: "bold", color: "white" },
  menuButton: { position: "absolute", right: 20, top: 70, padding: 5 },
  dropdown: {
    position: "absolute",
    right: 15,
    top: 100,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "600",
  },
  content: { padding: 20 },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    marginTop: 12,
    fontWeight: "600",
  },
  value: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#1E90FF",
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
  },
});
