import api from "@/src/api/api";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Code() {
  const [visible, setVisible] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Modal otomatis muncul saat tab Code difokuskan
  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      return () => setVisible(false);
    }, [])
  );

  const handleSubmit = async () => {
    if (!manualCode) {
      Alert.alert("Error", "Kode tidak boleh kosong");
      return;
    }
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const response = await api.post(
        "/presensi/scan",
        { qr_token: manualCode },
        {
          headers: {
            XAuthorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Berhasil", response.data?.message || "Presensi berhasil!");
      setVisible(false);
      setManualCode("");
      router.replace("/beranda"); // ✅ setelah submit sukses, balik ke beranda
    } catch (error: any) {
      Alert.alert("Gagal", error.response?.data?.message || "Presensi gagal.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    router.replace("/beranda"); // ✅ kalau batal, langsung redirect ke beranda
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.centered}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Input Kode Manual</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan kode"
              placeholderTextColor="#999"
              value={manualCode}
              onChangeText={setManualCode}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Mengirim..." : "Submit"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#aaa", marginTop: 8 }]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1E90FF",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
