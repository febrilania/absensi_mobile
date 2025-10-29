import Header from "@/components/header";
import { useUser } from "@/hooks/user";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const { user, loading } = useUser();
  const [modalVisible, setModalVisible] = useState(false);

  const fotoURI =
    user?.foto && user.foto !== ""
      ? user.foto
      : "https://sim.peradaban.ac.id/wp-content/uploads/mhs/data/default.png";

  return (
    <>
      <Header title="Data Pengguna" />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.fullCenter}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8, color: "#555" }}>Memuat data...</Text>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {user ? (
              <>
                {/* 🔹 Foto Profil */}
                <View style={styles.photoWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setModalVisible(true)}
                  >
                    <Image
                      source={{ uri: fotoURI }}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>

                {/* 🔹 Detail User */}
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
          </ScrollView>
        )}

        {/* 🔹 Modal Preview Gambar Fullscreen */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.background}
              onPress={() => setModalVisible(false)}
            />
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: fotoURI }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF", padding: 20 },
  fullCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F1FF",
  },
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  background: { ...StyleSheet.absoluteFillObject },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  fullImage: { width: "90%", height: "80%" },
  closeButton: { position: "absolute", top: 50, right: 30 },
});
