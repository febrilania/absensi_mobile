import api from "@/src/api/api";
import { storage } from "../utils/storage";

export const getUserData = async () => {
  const token = await storage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await api.get("/me", {
    headers: {
      XAuthorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data?.user || null;
};
