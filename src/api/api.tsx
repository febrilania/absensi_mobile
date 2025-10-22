import axios from "axios";
import * as SecureStore from "expo-secure-store";

/**
 * ✅ Konfigurasi instance axios
 */
const api = axios.create({
  baseURL: "https://sim.peradaban.ac.id/wp-json/simbaru/v1",
  headers: { "Content-Type": "application/json" },
});

/**
 * ✅ Simpan token & waktu kedaluwarsa
 */
export const saveToken = async (token: string, expiresIn: number) => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresIn * 1000); // detik → milidetik

  await SecureStore.setItemAsync("token", token);
  await SecureStore.setItemAsync("expires_at", expiresAt.toISOString());
};

/**
 * ✅ Ambil token dari SecureStore (dengan validasi waktu)
 */
export const getValidToken = async (): Promise<string | null> => {
  const token = await SecureStore.getItemAsync("token");
  const expiresAtStr = await SecureStore.getItemAsync("expires_at");

  if (!token || !expiresAtStr) return null;

  const expiresAt = new Date(expiresAtStr);
  const now = new Date();

  // Kalau token belum expired, langsung pakai
  if (now < expiresAt) {
    return token;
  }

  // Kalau sudah expired → coba refresh
  return await refreshToken();
};

/**
 * ✅ Refresh token otomatis
 */
export const refreshToken = async (): Promise<string | null> => {
  try {
    const oldToken = await SecureStore.getItemAsync("token");
    if (!oldToken) return null;

    const res = await axios.post(
      "https://sim.peradaban.ac.id/wp-json/simbaru/v1/refresh",
      {},
      {
        headers: {
          XAuthorization: `Bearer ${oldToken}`,
        },
      }
    );

    const newToken: string | undefined = res.data?.token;
    const expiresIn: number = res.data?.expires_in || 3600; // fallback 1 jam

    if (newToken) {
      await saveToken(newToken, expiresIn);
      api.defaults.headers.XAuthorization = `Bearer ${newToken}`;
      console.log("✅ Token diperbarui otomatis");
      return newToken;
    }

    return null;
  } catch (err) {
    console.error("❌ Gagal refresh token:", err);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("expires_at");
    await SecureStore.deleteItemAsync("role");
    return null;
  }
};

/**
 * ✅ Interceptor sebelum request → selalu pastikan token valid
 */
api.interceptors.request.use(async (config) => {
  const token = await getValidToken(); // otomatis cek dan refresh
  if (token) {
    config.headers.XAuthorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * ✅ Interceptor response → kalau 401, coba refresh sekali lagi
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.XAuthorization = `Bearer ${newToken}`;
        return api(originalRequest); // ulang request pakai token baru
      } else {
        // Refresh gagal → hapus token supaya login ulang
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("expires_at");
        await SecureStore.deleteItemAsync("role");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
