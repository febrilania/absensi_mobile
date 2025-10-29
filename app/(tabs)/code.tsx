import { usePresensiManual } from "@/hooks/mahasiswa/presensiCode";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Code() {
  const [visible, setVisible] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const router = useRouter();
  const { loading, submitManual } = usePresensiManual();

  // Modal otomatis muncul saat tab Code difokuskan
  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      return () => setVisible(false);
    }, [])
  );

  const handleSubmit = async () => {
    const success = await submitManual(manualCode);
    if (success) {
      setVisible(false);
      setManualCode("");
      router.replace("/beranda");
    }
  };

  const handleCancel = () => {
    setVisible(false);
    router.replace("/beranda");
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Modal
          visible={visible}
          transparent
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
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Mengirim..." : "Submit"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#aaa", marginTop: 8 },
                ]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
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
