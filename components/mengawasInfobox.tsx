import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  data: {
    makul: string;
    tanggal: string;
    ruang: string;
    kelas: string;
    dosen: string;
    jumlah_mahasiswa: number;
  };
  isSelesai: boolean;
}

export default function MengawasInfoBox({ data, isSelesai }: Props) {
  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View style={styles.card}>
      {/* 🔹 Judul Mata Kuliah */}
      <Text style={styles.makul}>{data.makul}</Text>

      {/* 🔹 Detail Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{formatTanggal(data.tanggal)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ruang</Text>
          <Text style={styles.value}>{data.ruang}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Kelas</Text>
          <Text style={styles.value}>{data.kelas}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Dosen</Text>
          <Text style={styles.value}>{data.dosen}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Jumlah Mahasiswa</Text>
          <Text style={styles.value}>{data.jumlah_mahasiswa}</Text>
        </View>
      </View>

      {/* 🔹 Badge Status di bagian bawah */}
      <View
        style={[
          styles.badge,
          isSelesai ? styles.badgeDone : styles.badgeActive,
        ]}
      >
        <Text style={styles.badgeText}>
          {isSelesai ? "Ujian Selesai" : "Sedang Berlangsung"}
        </Text>
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
    fontSize: 17,
    fontWeight: "700",
    color: "#1E90FF",
    marginBottom: 8,
  },
  infoContainer: {
    borderTopWidth: 0.6,
    borderColor: "#eee",
    paddingTop: 6,
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
    width: 160,
  },
  value: {
    flex: 1,
    textAlign: "left",
    color: "#333",
    fontSize: 15,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  badgeActive: { backgroundColor: "#1E90FF" },
  badgeDone: { backgroundColor: "#2E8B57" },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
});
