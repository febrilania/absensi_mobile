import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MengawasCatatan({
  catatan,
  setCatatan,
  isSelesai,
  savingCatatan,
  onSave,
}: any) {
  return (
    <View style={styles.catatanBox}>
      <Text style={styles.catatanLabel}>Catatan Pengawas:</Text>
      <TextInput
        style={[styles.catatanInput, isSelesai && { backgroundColor: "#eee" }]}
        editable={!isSelesai}
        value={catatan}
        onChangeText={setCatatan}
        multiline
      />
      {!isSelesai && (
        <TouchableOpacity
          style={styles.button}
          onPress={onSave}
          disabled={savingCatatan}
        >
          {savingCatatan ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>💾 Simpan Catatan</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  catatanBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  },
  catatanLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E90FF",
    marginBottom: 6,
  },
  catatanInput: {
    borderWidth: 1,
    borderColor: "#1E90FF",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    backgroundColor: "#F8FBFF",
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
