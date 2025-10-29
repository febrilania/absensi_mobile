import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MengawasActionButtons({
  isSelesai,
  loading,
  finishing,
  onGenerate,
  onFinish,
}: any) {
  if (isSelesai) {
    return (
      <Text style={styles.doneText}>
        ✅ Ujian telah diselesaikan. Semua fitur dinonaktifkan.
      </Text>
    );
  }

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, { marginBottom: 10 }]}
        onPress={onGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>📋 Generate Hadir Semua</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2E8B57" }]}
        onPress={onFinish}
        disabled={finishing}
      >
        {finishing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>✅ Selesai Ujian</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  doneText: {
    textAlign: "center",
    color: "#2E8B57",
    fontWeight: "bold",
    marginBottom: 15,
  },
});
