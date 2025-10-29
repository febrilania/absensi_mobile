import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MengajarItem {
  hari: string;
  jam_d: string;
  jam_s: string;
  makul: string;
  nm_kelas: string;
  ruang: string;
  sks: string;
}

export default function MengajarCard({ item }: { item: MengajarItem }) {
  const namaHari: Record<string, string> = {
    "1": "Senin",
    "2": "Selasa",
    "3": "Rabu",
    "4": "Kamis",
    "5": "Jumat",
    "6": "Sabtu",
    "7": "Ahad",
  };

  const hariText = namaHari[item.hari] || "-";
  const jamText =
    item.jam_d && item.jam_s ? `${item.jam_d} - ${item.jam_s}` : "-";

  return (
    <View style={styles.card}>
      {/* 🔹 Header: Hari dan Jam */}
      <View style={styles.cardHeader}>
        <Text style={styles.hariJam}>
          {hariText}, {jamText}
        </Text>
      </View>

      {/* 🔹 Mata kuliah */}
      <Text style={styles.makul}>{item.makul}</Text>

      {/* 🔹 Info tambahan */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Kelas</Text>
          <Text style={styles.value}>{item.nm_kelas || "-"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ruang</Text>
          <Text style={styles.value}>{item.ruang || "-"}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>SKS</Text>
          <Text style={styles.value}>{item.sks || "-"}</Text>
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
  cardHeader: {
    marginBottom: 6,
  },
  hariJam: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E90FF",
  },
  makul: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
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
    width: 90,
  },
  value: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    textAlign: "left",
  },
});
