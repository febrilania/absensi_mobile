import api from "@/src/api/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Minta izin kamera otomatis saat komponen pertama kali tampil
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

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
            XAuthorization: `Bearer ${token}`, // ✅ HARUS pakai Authorization, bukan XAuthorization
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

  if (!permission) {
    return <Text>Memeriksa izin kamera...</Text>;
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
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      )}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={styles.scanBox} />
      <View style={styles.overlay}>
        <Text style={styles.text}>Arahkan kamera ke QR Code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  scanBox: {
    position: "absolute",
    top: "30%",
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
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingBottom:30
  },
});
