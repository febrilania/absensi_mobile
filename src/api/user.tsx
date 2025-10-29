import api from "@/src/api/api";
import * as SecureStore from "expo-secure-store";

export const getUserData = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await api.get("/me", {
    headers: {
      XAuthorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data?.user || null;
};
