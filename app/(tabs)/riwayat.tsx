import Header from "@/components/header";
import RiwayatCard from "@/components/mahasiswa/riwayatCard";
import { useRiwayat } from "@/hooks/mahasiswa/riwayat";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Riwayat() {
  const { riwayat, loading, fetchRiwayat } = useRiwayat();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Header title="📖 Riwayat Presensi" showBack />
      <View style={styles.container}>
        {loading ? (
          // 🔹 Spinner seragam seperti halaman lain
          <View style={styles.fullCenter}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8, color: "#555" }}>
              Memuat data riwayat...
            </Text>
          </View>
        ) : (
          <FlatList
            data={riwayat}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RiwayatCard item={item} />}
            refreshing={loading}
            onRefresh={fetchRiwayat}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: insets.bottom + 90,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <View style={styles.fullCenter}>
                <Text style={{ color: "#555" }}>Riwayat tidak tersedia.</Text>
              </View>
            }
          />
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
