import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  selectedHari: number | null;
  onSelect: (hari: number) => void;
  title?: string; // <-- tambahkan ini
}

export default function HariFilter({ selectedHari, onSelect }: Props) {
  const namaHari: any = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    6: "Sabtu",
    7: "Ahad",
  };

  const barisHari = [
    [6, 7, 1],
    [2, 3, 4],
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.subTitle}>Pilih Hari</Text>
      {barisHari.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => onSelect(num)}
              style={[
                styles.filterButton,
                selectedHari === num && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedHari === num && styles.filterTextActive,
                ]}
              >
                {namaHari[num]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 8, marginBottom: 4 },
  subTitle: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 20,
  },
  row: { flexDirection: "row", justifyContent: "center", marginVertical: 4 },
  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#1E90FF",
    minWidth: 90,
    alignItems: "center",
  },
  filterButtonActive: { backgroundColor: "#1E90FF" },
  filterText: { color: "#1E90FF", fontWeight: "500" },
  filterTextActive: { color: "#fff" },
});
