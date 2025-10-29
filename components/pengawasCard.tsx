import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PengawasItem {
  mata_kuliah: string;
  tanggal: string;
  jam: string;
  ruang: string;
  kelas: string;
  prodi: string;
  status_ujian?: string;
}

interface Props {
  item: PengawasItem;
  onPress?: () => void;
}

export default function PengawasCard({ item, onPress }: Props) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Ujian Selesai":
        return { backgroundColor: "#2E8B57" }; // hijau lembut
      case "Sedang Berlangsung":
        return { backgroundColor: "#1E90FF" }; // biru cerah
      default:
        return { backgroundColor: "#FFB300" }; // kuning netral
    }
  };

  const formatTanggal = (tanggal: string) => {
    try {
      const date = new Date(tanggal);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return tanggal;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.card}>
        {/* 🔹 Badge Status */}
        {item.status_ujian && (
          <View style={[styles.statusBadge, getStatusStyle(item.status_ujian)]}>
            <Text style={styles.statusText}>{item.status_ujian}</Text>
          </View>
        )}

        {/* 🔹 Header */}
        <Text style={styles.makul}>{item.mata_kuliah}</Text>

        {/* 🔹 Detail Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>{formatTanggal(item.tanggal)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Jam</Text>
            <Text style={styles.value}>{item.jam ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ruang</Text>
            <Text style={styles.value}>{item.ruang ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kelas</Text>
            <Text style={styles.value}>{item.kelas ?? "-"}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Prodi</Text>
            <Text style={styles.value}>{item.prodi ?? "-"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  makul: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E90FF",
    marginBottom: 8,
  },
  infoContainer: {
    borderTopWidth: 0.6,
    borderColor: "#eee",
    paddingTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.6,
    borderColor: "#eee",
    paddingVertical: 6,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    fontSize: 15,
    width: 100,
  },
  value: {
    flex: 1,
    color: "#333",
    fontSize: 15,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
});
