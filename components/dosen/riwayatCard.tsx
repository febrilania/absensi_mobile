import { RiwayatItem } from "@/hooks/dosen/riwayatMengawas";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  item: RiwayatItem;
}

export default function RiwayatCard({ item }: Props) {
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
    <View style={styles.card}>
      {/* 🔹 Badge Status */}
      <View style={[styles.statusBadge, { backgroundColor: "#2E8B57" }]}>
        <Text style={styles.statusText}>{item.status_ujian || "Selesai"}</Text>
      </View>

      {/* 🔹 Header Mata Kuliah */}
      <View style={styles.headerRow}>
        <Ionicons name="book-outline" size={20} color="#1E90FF" />
        <Text style={styles.makul}>{item.mata_kuliah}</Text>
      </View>

      {/* 🔹 Materi (opsional) */}
      {item.materi ? (
        <Text style={styles.materiText}>{item.materi}</Text>
      ) : null}

      {/* 🔹 Info Detail */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{formatTanggal(item.tanggal)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Jam</Text>
          <Text style={styles.value}>{item.jam}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ruang</Text>
          <Text style={styles.value}>{item.ruang}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Kelas</Text>
          <Text style={styles.value}>
            {item.kelas} ({item.prodi})
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Dosen</Text>
          <Text style={styles.value}>{item.nama_dosen}</Text>
        </View>
      </View>

      {/* 🔹 Statistik Kehadiran */}
      <View style={styles.statContainer}>
        <Text style={styles.statText}>👨‍🎓 Mahasiswa: {item.jumlah_mhs}</Text>
        <Text style={styles.statText}>✅ Hadir: {item.hadir}</Text>
        <Text style={styles.statText}>❌ Tidak Hadir: {item.tidak_hadir}</Text>
      </View>

      {/* 🔹 Catatan (opsional) */}
      {item.catatan ? (
        <View style={styles.catatanContainer}>
          <Text style={styles.catatanLabel}>📝 Catatan</Text>
          <Text style={styles.catatanText}>{item.catatan}</Text>
        </View>
      ) : null}

      {/* 🔹 Footer Presensi */}
      <View style={styles.footer}>
        <Ionicons name="calendar-sharp" size={14} color="#555" />
        <Text style={styles.footerText}>
          Presensi: {formatTanggal(item.tgl_presensi || item.tanggal)}
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
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  makul: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#1E90FF",
    flexShrink: 1,
  },
  materiText: {
    fontSize: 11,
    color: "#555",
    fontStyle: "italic",
    marginBottom: 6,
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
    width: 100,
  },
  value: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    textAlign: "left",
  },
  statContainer: {
    backgroundColor: "#E8F4FF",
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statText: {
    color: "#1E90FF",
    fontWeight: "600",
    fontSize: 13,
  },
  catatanContainer: {
    backgroundColor: "#FAFAFA",
    borderLeftWidth: 3,
    borderLeftColor: "#1E90FF",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  catatanLabel: {
    fontWeight: "600",
    color: "#1E90FF",
    marginBottom: 4,
  },
  catatanText: {
    color: "#444",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  footerText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 4,
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
