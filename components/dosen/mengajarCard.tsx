import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MengajarItem {
  makul: string;
  nm_kelas: string;
  jam_d: string;
  jam_s: string;
  ruang: string;
  kd_makul: string;
  kd_ajar: string;
}

interface Props {
  item: MengajarItem;
}

export default function MengajarCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.makul}>{item.makul}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Kode MK</Text>
          <Text style={styles.value}>{item.kd_makul}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Kelas</Text>
          <Text style={styles.value}>{item.nm_kelas}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Jam</Text>
          <Text style={styles.value}>
            {item.jam_d} - {item.jam_s}
          </Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Ruang</Text>
          <Text style={styles.value}>{item.ruang}</Text>
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
    fontSize: 17,
    fontWeight: "700",
    color: "#1E90FF",
    marginBottom: 8,
    paddingRight: 80,
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
    textAlign: "left",
    color: "#333",
    fontSize: 15,
  },
});
