import PengawasCard from "@/components/pengawasCard";
import { usePengawas } from "@/hooks/dosen/pengawas";
import React from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Code() {
  const {
    visible,
    manualCode,
    loading,
    jadwal,
    setManualCode,
    handleSubmit,
    handleCancel,
    handleCardPress,
  } = usePengawas();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.container}>
          <Text style={styles.title}>📷 Scan / Input Kode Pengawas</Text>

          <TextInput
            style={styles.input}
            placeholder="Masukkan kode QR"
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
              {loading ? "Mengambil data..." : "Kirim"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#aaa", marginTop: 8 }]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Batal</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20, flex: 1 }}>
            {jadwal.length === 0 ? (
              <View style={styles.center}>
                <Text style={{ color: "#555", marginTop: 20 }}>
                  Tidak ada jadwal pengawas hari ini.
                </Text>
              </View>
            ) : (
              <FlatList
                data={jadwal}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <PengawasCard
                    item={item}
                    onPress={() => handleCardPress(item)}
                  />
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F1FF",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  center: { justifyContent: "center", alignItems: "center" },
});
