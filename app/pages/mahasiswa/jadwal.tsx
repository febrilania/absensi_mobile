import HariFilter from "@/components/hariFilter";
import Header from "@/components/header";
import JadwalCard from "@/components/mahasiswa/jadwalCard";
import { useJadwal } from "@/hooks/mahasiswa/jadwal";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Jadwal() {
  const { loading, filteredJadwal, selectedDay, setSelectedDay } = useJadwal();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* 🔹 Header Global */}
        <Header title="Jadwal Kuliah" showBack />

        {/* 🔹 Filter Hari */}
        <HariFilter
          selectedHari={selectedDay ? parseInt(selectedDay) : null}
          onSelect={(hari) => setSelectedDay(String(hari))}
        />

        {/* 🔹 Daftar Jadwal */}
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : filteredJadwal && filteredJadwal.length > 0 ? (
            filteredJadwal
              .filter((item) => item) // 🧱 pastikan gak undefined
              .map((item, i) => <JadwalCard key={item?.id ?? i} item={item} />)
          ) : selectedDay ? (
            <Text style={styles.noData}>Tidak ada jadwal hari ini</Text>
          ) : (
            <Text style={styles.noData}>Pilih hari terlebih dahulu</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF", paddingBottom:30 },
  noData: {
    textAlign: "center",
    marginTop: 40,
    color: "#555",
    fontSize: 15,
  },
});
