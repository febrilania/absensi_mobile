import { HelloWave } from "@/components/hello-wave"; // opsional kalau mau efek 👋
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface WelcomeCardProps {
  nama?: string;
  role?: string;
  foto?: string;
}

export default function WelcomeCard({
  nama = "Pengguna",
  role = "Pengguna",
  foto,
}: WelcomeCardProps) {
  // Ubah role jadi huruf kapital di awal
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <View style={styles.welcomeCard}>
      {/* Foto profil atau icon default */}
      {foto ? (
        <Image
          source={{ uri: foto }}
          style={styles.profileImage}
          resizeMode="cover"
        />
      ) : (
        <Ionicons name="person-circle-outline" size={60} color="#1E90FF" />
      )}

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.welcomeText}>
          <HelloWave /> Selamat datang, <Text style={styles.bold}>{nama}</Text>
        </Text>
        {role && (
          <Text style={styles.roleText}>Anda login sebagai {roleLabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#1E90FF",
    backgroundColor: "#eee",
  },
  welcomeText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  roleText: {
    fontSize: 14,
    color: "#1E90FF",
    fontWeight: "600",
  },
});
