import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

// 🧩 Pastikan type props mencakup semua yang digunakan
export interface MenuCardProps {
  label: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean; // ✅ tambahkan properti ini
  comingSoon?: boolean; // ✅ dan ini
}

export default function MenuCard({
  label,
  icon,
  onPress,
  disabled = false,
  comingSoon = false,
}: MenuCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 60) / 2; // agar responsif

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      onPress={!disabled ? onPress : undefined}
      style={[styles.card, { width: cardWidth, opacity: disabled ? 0.7 : 1 }]}
    >
      <View style={styles.cardInner}>
        <Ionicons
          name={icon as any}
          size={34}
          color={disabled ? "#555" : "#1E90FF"}
        />
        <Text
          style={[styles.cardTitle, { color: disabled ? "#555" : "#333" }]}
          numberOfLines={2}
        >
          {label}
        </Text>

        {comingSoon && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Coming Soon</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 24,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardInner: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    color: "#fff",
    fontWeight: "600",
  },
});
