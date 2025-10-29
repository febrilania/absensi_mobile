import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ListMhs({ data, onAbsen, loading, isSelesai }: any) {
  const getStatusText = (absen: number) => {
    switch (absen) {
      case 1:
        return "Alpa";
      case 2:
        return "Hadir";
      case 3:
        return "Ijin";
      case 4:
        return "Sakit";
      case 5:
        return "Dispensasi";
      default:
        return "Belum Absen";
    }
  };

  const getColor = (absen: number) => {
    switch (absen) {
      case 2:
        return "#2E8B57"; // Hijau
      case 1:
        return "#DC143C"; // Merah
      case 3:
        return "#FF8C00"; // Oranye
      case 4:
        return "#1E90FF"; // Biru
      case 5:
        return "#8A2BE2"; // Ungu
      default:
        return "#555";
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.nim}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* 🔹 Header: Nama & NIM */}
          <View style={styles.headerRow}>
            <Text style={styles.nama}>{item.nama}</Text>
            <Text style={styles.nim}>{item.nim}</Text>
          </View>

          {/* 🔹 Status Absen */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getColor(item.absen) + "22" }, // sedikit transparan
              item.absen && { borderLeftColor: getColor(item.absen) },
            ]}
          >
            <Text style={[styles.statusText, { color: getColor(item.absen) }]}>
              {getStatusText(item.absen)}
            </Text>
          </View>

          {/* 🔹 Tombol Pilihan Absen */}
          <View style={styles.buttonRow}>
            {[
              { label: "Alpa", value: "1" },
              { label: "Hadir", value: "2" },
              { label: "Ijin", value: "3" },
              { label: "Sakit", value: "4" },
              { label: "Disp.", value: "5" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.absenButton,
                  item.absen === parseInt(opt.value) &&
                    styles.absenButtonActive,
                  isSelesai && { opacity: 0.5 },
                ]}
                onPress={() => onAbsen(item.nim, opt.value)}
                disabled={loading || isSelesai}
              >
                <Text
                  style={[
                    styles.absenButtonText,
                    item.absen === parseInt(opt.value) && { color: "#fff" },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nama: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E90FF",
    flexShrink: 1,
    marginRight: 10,
  },
  nim: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
  statusBadge: {
    borderLeftWidth: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
  },
  absenButton: {
    borderWidth: 1,
    borderColor: "#1E90FF",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexGrow: 1,
    alignItems: "center",
    marginVertical: 4,
    marginHorizontal: 2,
    minWidth: 60,
  },
  absenButtonActive: {
    backgroundColor: "#1E90FF",
    borderColor: "#1E90FF",
  },
  absenButtonText: {
    color: "#1E90FF",
    fontSize: 13,
    fontWeight: "600",
  },
});
