import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  item: any;
}

export default function UjianCard({ item }: Props) {
  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={styles.card}>
      {/* 🔹 Header Mata Kuliah */}
      <Text style={styles.makul}>{item.mata_kuliah}</Text>

      {/* 🔹 Info Detail */}
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

        <View style={styles.infoRow}>
          <Text style={styles.label}>Prodi</Text>
          <Text style={styles.value}>{item.prodi ?? "-"}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Dosen</Text>
          <Text style={styles.value}>{item.nama_dosen ?? "-"}</Text>
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
});
