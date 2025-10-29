import RiwayatCard from "@/components/dosen/riwayatCard";
import Header from "@/components/header";
import { useRiwayatMengawas } from "@/hooks/dosen/riwayatMengawas";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";

export default function RiwayatDosen() {
  const { riwayat, loading, refreshing, fetchRiwayat, onRefresh } =
    useRiwayatMengawas();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <>
      <Header title="Riwayat Mengawas" />
      <View style={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8, color: "#555" }}>Memuat data...</Text>
          </View>
        ) : (
          <FlatList
            data={riwayat}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              padding: 16,
              paddingBottom: insets.bottom + 90,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={{ color: "#555", marginTop: 30 }}>
                  Belum ada riwayat mengawas.
                </Text>
              </View>
            }
            renderItem={({ item }) => <RiwayatCard item={item} />}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, backgroundColor: "#E8F1FF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
