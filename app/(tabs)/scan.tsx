import api from "@/src/api/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBarCodeScanned = async ({ data }: any) => {
    setScanned(true);
    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        return;
      }

      console.log("QR Data:", data);

      const response = await api.post(
        "/presensi/scan",
        { qr_token: data },
        {
          headers: {
            XAuthorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      Alert.alert("Berhasil", response.data?.message || "Presensi berhasil!");
    } catch (error: any) {
      console.error("Error scan:", error.response?.data || error.message);
      Alert.alert("Gagal", error.response?.data?.message || "Presensi gagal.");
    } finally {
      setLoading(false);
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (!permission) {
    return <Text>Meminta izin kamera...</Text>;
  }

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
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Arahkan kamera ke QR Code</Text>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  text: { color: "#fff", fontSize: 16, marginBottom: 50 },
});
