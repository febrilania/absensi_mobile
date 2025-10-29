import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PertemuanItem {
  id_token?: string;
  pertemuan: string;
  tgl: string;
  waktu?: string;
  materi?: string;
  link?: string;
  status_presensi?: string;
  kd_ajar?: string;
}

interface Props {
  item: PertemuanItem;
}

export default function PertemuanCard({ item }: Props) {
  const router = useRouter();

  const formatTanggal = (tgl: string) => {
    const date = new Date(tgl);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "HADIR":
        return "#2E8B57";
      case "ALPHA":
        return "#DC143C";
      default:
        return "#FFB300";
    }
  };

  const handlePress = () => {
    router.push({
      pathname: "/pages/mahasiswa/pertemuan",
      params: { kd_ajar: item.kd_ajar, pertemuan: item.pertemuan },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.card}>
        {/* 🔹 Badge Status */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor(item.status_presensi ?? "") },
          ]}
        >
          <Text style={styles.statusText}>{item.status_presensi ?? "-"}</Text>
        </View>

        {/* 🔹 Header */}
        <View style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={22} color="#1E90FF" />
          <Text style={styles.ket}>Pertemuan {item.pertemuan}</Text>
        </View>

        {/* 🔹 Info Detail */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>{formatTanggal(item.tgl)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Waktu</Text>
            <Text style={styles.value}>{item.waktu?.split(" ")[1] ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Materi</Text>
            <Text style={styles.value}>{item.materi ?? "-"}</Text>
          </View>

          {/* 🔹 Link kiri */}
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Link</Text>
            {item.link ? (
              <TouchableOpacity
                style={styles.linkButtonWrapper}
                onPress={() => {
                  import("react-native").then(({ Linking }) => {
                    Linking.openURL(item.link!);
                  });
                }}
              >
                <View style={styles.linkButton}>
                  <Text style={styles.linkText}>Zoom Meeting</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.value}>-</Text>
            )}
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
    width: 90,
  },
  value: {
    flex: 1,
    color: "#333",
    fontSize: 15,
  },

  // ✅ Bagian tombol biar rata kiri
  linkButtonWrapper: {
    flex: 1,
    alignItems: "flex-start", // tombol geser ke kiri
  },
  linkButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  linkText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
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
