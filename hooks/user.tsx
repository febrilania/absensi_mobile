import api from "@/src/api/api";
import { getAppRole } from "@/src/utils/roleMapper";
import { storage } from "@/src/utils/storage";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<
    "mahasiswa" | "dosen" | "karyawan" | "unknown"
  >("unknown");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await storage.getItem("token");
        if (!token) return;

        const response = await api.get("/me", {
          headers: { XAuthorization: `Bearer ${token}` },
        });

        if (response.data?.user) {
          setUser(response.data.user);
          setRole(getAppRole(response.data.user.role)); // ✅ konversi di sini
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, role, loading };
}
