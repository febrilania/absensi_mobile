import api from "@/src/api/api";
import { getAppRole } from "@/src/utils/roleMapper";
import { storage } from "@/src/utils/storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<
    "mahasiswa" | "dosen" | "karyawan" | "unknown"
  >("unknown");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await storage.getItem("token");

        // 🚫 Kalau tidak ada token, arahkan ke login
        if (!token) {
          setLoading(false);
          router.replace("/login");
          return;
        }

        const response = await api.get("/me", {
          headers: { XAuthorization: `Bearer ${token}` },
        });

        if (response.data?.user) {
          setUser(response.data.user);
          setRole(getAppRole(response.data.user.role)); // ✅ konversi di sini
        } else {
          // 🚫 kalau respon tidak valid, hapus session
          await storage.deleteItem("token");
          await storage.deleteItem("role");
          router.replace("/login");
        }
      } catch (error: any) {
        console.error("Gagal mengambil data user:", error);

        // 🚫 Jika token invalid / expired → logout paksa
        if (error.response?.status === 401) {
          await storage.deleteItem("token");
          await storage.deleteItem("role");
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, role, loading };
}
