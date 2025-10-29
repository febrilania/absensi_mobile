import Header from "@/components/header";
import PertemuanCard from "@/components/mahasiswa/pertemuanCard";
import { usePertemuan } from "@/hooks/mahasiswa/pertemuan";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Pertemuan() {
  const { kd_ajar, jadwal } = useLocalSearchParams();
  const { pertemuan, loading, refreshing, setRefreshing, fetchPertemuan } =
    usePertemuan(kd_ajar);

  let dataJadwal = null;
  if (jadwal) {
    const jadwalStr = Array.isArray(jadwal) ? jadwal[0] : jadwal;
    try {
      dataJadwal = JSON.parse(jadwalStr);
    } catch {
      console.warn("Error parsing jadwal");
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Pertemuan" showBack  />

      <View style={styles.container}>
        {/* 🔹 Informasi Jadwal Kuliah */}
        {dataJadwal && (
          <View style={styles.jadwalInfoCard}>
            <Text style={styles.jadwalMakul}>{dataJadwal.makul}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Dosen</Text>
              <Text style={styles.value}>{dataJadwal.nmdosen}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Kelas</Text>
              <Text style={styles.value}>{dataJadwal.nm_kelas}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Jam</Text>
              <Text style={styles.value}>
                {dataJadwal.jam_d} - {dataJadwal.jam_s}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Ruang</Text>
              <Text style={styles.value}>{dataJadwal.ruang}</Text>
            </View>
          </View>
        )}

        {/* 🔹 Daftar Pertemuan */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchPertemuan();
              }}
            />
          }
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#1E90FF"
              style={{ marginTop: 40 }}
            />
          ) : pertemuan.length > 0 ? (
            pertemuan.map((item) => (
              <PertemuanCard
                key={item.id_token ?? Math.random().toString()}
                item={{ ...item, kd_ajar: kd_ajar as string }}
              />
            ))
          ) : (
            <Text style={styles.noData}>Tidak ada data pertemuan</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF", paddingBottom:20},

  // 🔹 Kartu informasi jadwal
  jadwalInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#1E90FF40",
  },

  jadwalMakul: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E90FF",
    marginBottom: 10,
    textAlign: "center",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingBottom: 4,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    fontSize: 15,
    flex: 1,
  },
  value: {
    fontWeight: "500",
    color: "#333",
    textAlign: "left",
    flex: 4,
  },

  // 🔹 Area scroll daftar pertemuan
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 4,
  },

  // 🔹 Pesan kosong
  noData: {
    textAlign: "center",
    marginTop: 40,
    color: "#555",
    fontSize: 15,
  },
});
