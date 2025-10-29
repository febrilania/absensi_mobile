import HariFilter from "@/components/hariFilter";
import Header from "@/components/header";
import JadwalCard from "@/components/mahasiswa/jadwalCard";
import { useJadwal } from "@/hooks/mahasiswa/jadwal";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Jadwal() {
  const { loading, filteredJadwal, selectedDay, setSelectedDay } = useJadwal();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="📅 Jadwal Kuliah" showBack />

      <View style={styles.container}>
        {loading ? (
          // 🔹 Spinner konsisten di tengah
          <View style={styles.fullCenter}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8, color: "#555" }}>
              Memuat jadwal kuliah...
            </Text>
          </View>
        ) : (
          <>
            {/* 🔹 Filter hari */}
            <HariFilter
              selectedHari={selectedDay ? parseInt(selectedDay) : null}
              onSelect={(hari) => setSelectedDay(String(hari))}
            />

            {/* 🔹 Kondisi data */}
            {selectedDay === null ? (
              <View style={styles.fullCenter}>
                <Text style={{ color: "#555" }}>
                  Silakan pilih hari terlebih dahulu.
                </Text>
              </View>
            ) : filteredJadwal.length === 0 ? (
              <View style={styles.fullCenter}>
                <Text style={{ color: "#555" }}>
                  Tidak ada jadwal di hari ini.
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredJadwal}
                keyExtractor={(item, i) => item?.id?.toString() ?? i.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
                renderItem={({ item }) => <JadwalCard item={item} />}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF" },
  fullCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F1FF",
  },
});
