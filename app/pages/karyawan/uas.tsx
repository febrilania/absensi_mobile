import HariFilter from "@/components/hariFilter";
import Header from "@/components/header";
import UjianCard from "@/components/ujianCard";
import { useUas } from "@/hooks/uas";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function UAS() {
  const { loading, filteredJadwal, selectedHari, filterByHari } = useUas();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="📕 Jadwal UAS" showBack />

      <View style={styles.container}>
        {/* 🔹 Spinner konsisten di tengah layar */}
        {loading ? (
          <View style={styles.fullCenter}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8, color: "#555" }}>
              Memuat jadwal UAS...
            </Text>
          </View>
        ) : (
          <>
            {/* 🔹 Filter hari di atas */}
            <HariFilter selectedHari={selectedHari} onSelect={filterByHari} />

            {/* 🔹 Kondisi tampilan data */}
            {selectedHari === null ? (
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
                keyExtractor={(_, i) => i.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
                renderItem={({ item }) => <UjianCard item={item} />}
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
