import { Alert, Platform } from "react-native";

/**
 * Fungsi konfirmasi universal: bekerja di Web dan Mobile
 */
export async function confirmDialog(
  title: string,
  message: string
): Promise<boolean> {
  if (Platform.OS === "web") {
    return window.confirm(`${title}\n\n${message}`);
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "Batal", style: "cancel", onPress: () => resolve(false) },
      { text: "Ya", onPress: () => resolve(true) },
    ]);
  });
}

/**
 * Fungsi alert biasa universal
 */
export function showAlert(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}
