import api from "@/src/api/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitCode = async (code: string) => {
    if (!code) return;
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const response = await api.post(
        "/presensi/scan",
        { qr_token: code },
        {
          headers: {
            XAuthorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Berhasil", response.data?.message || "Presensi berhasil!");
    } catch (error: any) {
      Alert.alert("Gagal", error.response?.data?.message || "Presensi gagal.");
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    submitCode(data);
  };

  if (!permission) return <Text>Meminta izin kamera...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Izin kamera ditolak</Text>
        <Text onPress={requestPermission} style={{ color: "blue" }}>
          Beri izin kamera
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#1E90FF" />}

      {/* Kamera full screen */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Kotak scan di tengah */}
      <View style={styles.scanBox} />

      {/* Overlay input manual */}
      <View style={styles.overlay}>
        <Text style={styles.text}>Arahkan kamera ke QR Code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scanBox: {
    position: "absolute",
    top: "30%", // posisikan di tengah layar
    alignSelf: "center",
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#1E90FF",
    borderRadius: 12,
    backgroundColor: "transparent",
    zIndex: 5,
  },
  overlay: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 8,
    width: "90%",
    zIndex: 10,
    elevation: 10,
  },
  text: { color: "#fff", fontSize: 16, marginBottom: 10, textAlign: "center" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    color: "#000",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
