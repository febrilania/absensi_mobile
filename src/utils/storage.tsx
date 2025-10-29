import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storage = {
  async getItem(key: string) {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error("Error getting item:", error);
      return null;
    }
  },

  async setItem(key: string, value: string) {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error("Error setting item:", error);
    }
  },

  async deleteItem(key: string) {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  },
};
