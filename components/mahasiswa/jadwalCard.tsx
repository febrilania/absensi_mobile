import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface JadwalItem {
  id?: number;
  makul?: string;
  kuliah?: string;
  kd_makul?: string;
  kd_ajar?: string;
  nmdosen?: string;
  wa_dosen?: string;
  nm_kelas?: string;
  jam_d?: string;
  jam_s?: string;
  ruang?: string;
}

interface Props {
  item?: JadwalItem;
}

export default function JadwalCard({ item }: Props) {
  const router = useRouter();

  if (!item) return null;

  const handlePress = () => {
    if (!item.kd_ajar) return;
    router.push({
      pathname: "/pages/mahasiswa/pertemuan",
      params: {
        jadwal: JSON.stringify(item),
        kd_ajar: item.kd_ajar,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.card}>
        {/* 🔹 Badge Jenis Kuliah */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.kuliah || "Tatap Muka"}</Text>
        </View>

        {/* 🔹 Header Mata Kuliah */}
        <View style={styles.cardHeader}>
          <Ionicons name="book-outline" size={22} color="#1E90FF" />
          <Text style={styles.ket}>{item.makul ?? "-"}</Text>
        </View>

        {/* 🔹 Info Detail */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kode MK</Text>
            <Text style={styles.value}>{item.kd_makul ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Dosen</Text>
            <Text style={styles.value}>{item.nmdosen ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>No HP</Text>
            <Text style={styles.value}>{item.wa_dosen || "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Kelas</Text>
            <Text style={styles.value}>{item.nm_kelas ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Jam</Text>
            <Text style={styles.value}>
              {item.jam_d && item.jam_s ? `${item.jam_d} - ${item.jam_s}` : "-"}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Ruang</Text>
            <Text style={styles.value}>{item.ruang ?? "-"}</Text>
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
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#1E90FF",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ket: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#1E90FF",
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
    textAlign: "left",
    color: "#333",
    fontSize: 15,
  },
});
