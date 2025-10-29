import MengajarCard from "@/components/dosen/mengajarCard";
import Header from "@/components/header";
import { useMengajar } from "@/hooks/dosen/mengajar";
import { Stack } from "expo-router";
import React from "react";
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Jadwal Mengajar" showBack />

      <View style={styles.container}>
        {loading ? (
          // 🔹 Spinner full screen dengan teks "Memuat data..."
          <View style={styles.fullCenter}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={{ marginTop: 8, color: "#555" }}>Memuat data...</Text>
          </View>
        ) : (
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
            {data.length > 0 ? (
              data.map((item, i) => <MengajarCard key={i} item={item} />)
            ) : (
              <Text style={styles.noData}>
                Tidak ada jadwal mengajar tersedia.
              </Text>
            )}
          </ScrollView>
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
  noData: {
    textAlign: "center",
    marginTop: 40,
    color: "#555",
    fontSize: 15,
  },
});
