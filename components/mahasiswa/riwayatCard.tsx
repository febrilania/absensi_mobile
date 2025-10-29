import React from "react";
import { StyleSheet, Text, View } from "react-native";

// 🧩 Tipe data untuk setiap item riwayat
export interface RiwayatItem {
  id: number;
  status: number;
  makul: string;
  pertemuan: string | number;
  tgl: string;
  nmdosen: string;
}

// 🧩 Props untuk komponen RiwayatCard
interface RiwayatCardProps {
  item: RiwayatItem;
}

// 🔹 Fungsi label status
const getStatusLabel = (status: number): string => {
  switch (status) {
    case 1:
      return "ALPHA";
    case 2:
      return "HADIR";
    case 3:
      return "IJIN";
    case 4:
      return "SAKIT";
    case 5:
      return "DISPENSASI";
    default:
      return "TIDAK DIKETAHUI";
  }
};

// 🔹 Fungsi format tanggal
const formatTanggal = (tanggal: string): string => {
  const date = new Date(tanggal);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 🔹 Komponen utama
export default function RiwayatCard({ item }: RiwayatCardProps) {
  // Warna badge berdasarkan status
  const badgeColorMap: Record<number, string> = {
    1: "#DC143C", // Alpha
    2: "#2E8B57", // Hadir
    3: "#FF9800", // Ijin
    4: "#1E90FF", // Sakit
    5: "#9C27B0", // Dispensasi
  };

  const badgeColor = badgeColorMap[item.status] ?? "#999";

  return (
    <View style={styles.card}>
      {/* 🔹 Badge Status */}
      <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
      </View>

      {/* 🔹 Mata Kuliah */}
      <Text style={styles.makul}>{item.makul}</Text>

      {/* 🔹 Info Detail */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Pertemuan</Text>
          <Text style={styles.value}>{item.pertemuan}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{formatTanggal(item.tgl)}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Dosen</Text>
          <Text style={styles.value}>{item.nmdosen}</Text>
        </View>
      </View>
    </View>
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
    paddingRight: 80,
  },
  infoContainer: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.6,
    borderColor: "#eee",
    paddingVertical: 6,
    flexWrap: "wrap",
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
