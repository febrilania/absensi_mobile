import MengajarCard from "@/components/dosen/mengajarCard";
import HariFilter from "@/components/hariFilter";
import Header from "@/components/header";
import { useMengajar } from "@/hooks/dosen/mengajar";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Mengajar() {
  const { data, loading, refreshing, setRefreshing, fetchMengajar } =
    useMengajar();
  const [selectedHari, setSelectedHari] = useState<number | null>(null);

  // 🔹 Map angka hari ke nama hari
  const namaHari: Record<string, string> = {
    "1": "Senin",
    "2": "Selasa",
    "3": "Rabu",
    "4": "Kamis",
    "5": "Jumat",
    "6": "Sabtu",
    "7": "Ahad",
  };

  // 🔹 Filter data sesuai hari yang dipilih
  const filteredData = selectedHari
    ? data.filter((item) => Number(item.hari) === selectedHari)
    : [];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Jadwal Mengajar" showBack />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchMengajar();
              }}
            />
          }
        >
          {/* 🔹 Komponen filter hari */}
          <HariFilter
            selectedHari={selectedHari}
            onSelect={(hari) => setSelectedHari(hari)}
          />

          {/* 🔹 Konten utama */}
          {loading ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : selectedHari === null ? (
            <Text style={styles.infoText}>
              Silakan pilih hari terlebih dahulu untuk melihat jadwal mengajar.
            </Text>
          ) : filteredData.length > 0 ? (
            <>
              <Text style={styles.hariTitle}>
                Jadwal Hari {namaHari[selectedHari.toString()]}
              </Text>
              {filteredData.map((item, i) => (
                <MengajarCard key={i} item={item} />
              ))}
            </>
          ) : (
            <Text style={styles.noData}>
              Tidak ada jadwal mengajar pada hari{" "}
              {namaHari[selectedHari.toString()]}.
            </Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF" },
  infoText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
    color: "#444",
  },
  hariTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E90FF",
    marginVertical: 10,
    paddingLeft: 4,
  },
  noData: {
    textAlign: "center",
    marginTop: 40,
    color: "#555",
    fontSize: 15,
  },
});
