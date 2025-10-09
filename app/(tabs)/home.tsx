import api from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Animated values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(30))[0];
  const bounceAnim = useState(new Animated.Value(0.5))[0];
  const headerAnim = useState(new Animated.Value(-100))[0]; // header mulai dari atas layar

  const runAnimation = () => {
    fadeAnim.setValue(0);
    translateY.setValue(30);
    bounceAnim.setValue(0.5);
    headerAnim.setValue(-100);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

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

      const response = await api.get("/me", {
        headers: {
          XAuthorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.user) {
        setUser(response.data.user);
        runAnimation();
      } else {
        Alert.alert(
          "Gagal",
          response.data?.message || "Data user tidak ditemukan."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", "Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Jalankan animasi ulang setiap kali screen difokuskan
  useFocusEffect(
    useCallback(() => {
      if (user) {
        runAnimation();
      }
    }, [user])
  );

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Logout", "Berhasil logout!");
    setShowMenu(false);
    router.replace("/");
  };

  const onRefresh = () => {
    setRefreshing(true);
    getUserData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1E90FF" />

      {/* Header dengan animasi turun dari atas */}
      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerAnim }] }]}
      >
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
      </Animated.View>

      {/* Konten dengan ScrollView + RefreshControl */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : user ? (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY }],
            }}
          >
            {/* Foto Profil dengan bounce */}
            <View style={styles.photoWrapper}>
              <Animated.Image
                source={{
                  uri: user.foto
                    ? user.foto
                    : "https://sim.peradaban.ac.id/wp-content/uploads/mhs/data/default.png",
                }}
                style={[
                  styles.photo,
                  {
                    transform: [{ scale: bounceAnim }],
                  },
                ]}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.label}>Nama Lengkap</Text>
            <Text style={styles.value}>{user.nama}</Text>

            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{user.username}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>No HP</Text>
            <Text style={styles.value}>{user.hp}</Text>
          </Animated.View>
        ) : (
          <Text style={{ textAlign: "center", color: "#555" }}>
            Data tidak tersedia.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF" },
  header: {
    backgroundColor: "#1E90FF",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  logo: { width: "40%", height: 90, marginBottom: 5 },
  title: { fontSize: 22, fontWeight: "bold", color: "white" },
  menuButton: { position: "absolute", right: 20, top: 30, padding: 5 },
  dropdown: {
    position: "absolute",
    right: 15,
    top: 70,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
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
  photoWrapper: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  photo: {
    width: 150,
    height: 200,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#1E90FF",
    backgroundColor: "#eee",
  },
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
