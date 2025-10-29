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

export default function Riwayat() {
  const { riwayat, loading, fetchRiwayat } = useRiwayat();

  return (
    <>
      <Header title="Riwayat Presensi" />
      <View style={styles.container}>
        <View style={styles.content}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#1E90FF" />
              <Text style={{ marginTop: 8, color: "#555" }}>
                Memuat data...
              </Text>
            </View>
          ) : (
            <FlatList
              data={riwayat}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <RiwayatCard item={item} />}
              refreshing={loading}
              onRefresh={fetchRiwayat}
              contentContainerStyle={{ paddingBottom: 60 }}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", color: "#555" }}>
                  Riwayat tidak tersedia.
                </Text>
              }
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F1FF", paddingBottom:50 },
  content: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
