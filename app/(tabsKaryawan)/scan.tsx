import PengawasCard from "@/components/pengawasCard";
import { useScanMengawas } from "@/hooks/dosen/pengawasScan";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScanKaryawan() {
  const {
    jadwal,
    loading,
    scanned,
    setScanned,
    qrToken,
    setQrToken,
    fetchJadwal,
    openDetail,
    resetScan,
  } = useScanMengawas();

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  // === Ketika QR discan ===
  const handleBarcodeScanned = async (result: any) => {
    if (scanned) return;
    const qrData = result?.data;
    if (!qrData) {
      Alert.alert("Error", "QR Code tidak valid");
      return;
    }
    setScanned(true);
    setQrToken(qrData);
    await fetchJadwal(qrData);
  };

  if (!permission)
    return (
      <View style={styles.center}>
        <Text>Memeriksa izin kamera...</Text>
      </View>
    );

  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Izin kamera belum diberikan.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E8F1FF" }}>
      {!scanned ? (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.scannerBox} />
            <Text style={styles.overlayText}>Arahkan kamera ke QR Code</Text>
          </View>
        </CameraView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>📋 Jadwal Mengawas</Text>

          {loading && <ActivityIndicator size="large" color="#1E90FF" />}

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {jadwal.length === 0 && !loading ? (
              <View style={styles.center}>
                <Text style={{ color: "#555", marginTop: 20 }}>
                  Tidak ada jadwal pengawas hari ini.
                </Text>
              </View>
            ) : (
              jadwal.map((item, index) => (
                <PengawasCard
                  key={index}
                  item={item}
                  onPress={() => openDetail(item)}
                />
              ))
            )}

            <TouchableOpacity
              style={[styles.button, { marginTop: 20, marginBottom: 40 }]}
              onPress={resetScan}
            >
              <Text style={styles.buttonText}>🔄 Scan Ulang</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scannerBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#00a3eeff",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  overlayText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
