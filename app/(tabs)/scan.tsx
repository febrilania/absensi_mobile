import { usePresensiScan } from "@/hooks/mahasiswa/presensiScan";
import { CameraView, useCameraPermissions } from "expo-camera";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { loading, scanned, handleScan } = usePresensiScan();

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Memeriksa izin kamera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Izin kamera ditolak</Text>
        <Text onPress={requestPermission} style={styles.link}>
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
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : ({ data }) => handleScan(data)}
      />

      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.text}>Arahkan kamera ke QR Code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  link: { color: "blue", marginTop: 8 },
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
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#1E90FF",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
});
