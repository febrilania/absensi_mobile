import HariFilter from "@/components/hariFilter";
import Header from "@/components/header";
import UjianCard from "@/components/ujianCard";
import { useUts } from "@/hooks/uts";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function UTS() {
  const { loading, filteredJadwal, selectedHari, filterByHari } = useUts();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Header title="📘 Jadwal UTS" showBack />

        <HariFilter selectedHari={selectedHari} onSelect={filterByHari} />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8 }}>Memuat jadwal UTS...</Text>
          </View>
        ) : selectedHari === null ? (
          <View style={styles.center}>
            <Text style={{ color: "#555" }}>
              Silakan pilih hari terlebih dahulu.
            </Text>
          </View>
        ) : filteredJadwal.length === 0 ? (
          <View style={styles.center}>
            <Text style={{ color: "#555" }}>Tidak ada jadwal di hari ini.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredJadwal}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => <UjianCard item={item} />}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
