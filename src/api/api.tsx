import axios from "axios";
import * as SecureStore from "expo-secure-store";

/**
 * ✅ Konfigurasi instance axios utama
 */
const api = axios.create({
  baseURL: "https://sim.peradaban.ac.id/wp-json/simbaru/v1",
  headers: { "Content-Type": "application/json" },
});

api.defaults.headers.common["Accept"] = "application/json";

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
 * ✅ Ambil token valid dari SecureStore
 * Jika sudah expired → refresh otomatis
 */
export const getValidToken = async (): Promise<string | null> => {
  const token = await SecureStore.getItemAsync("token");
  const expiresAtStr = await SecureStore.getItemAsync("expires_at");

  if (!token || !expiresAtStr) return null;

  const expiresAt = new Date(expiresAtStr);
  const now = new Date();

  if (now < expiresAt) {
    return token; // Masih valid
  }

  // Token expired → refresh otomatis
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
        headers: { XAuthorization: `Bearer ${oldToken}` },
      }
    );

    const newToken: string | undefined = res.data?.token;
    const expiresIn: number = res.data?.expires_in || 3600;

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
 * ✅ Interceptor: sebelum request → pastikan token valid
 */
api.interceptors.request.use(async (config) => {
  const token = await getValidToken();
  if (token) {
    config.headers.XAuthorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * ✅ Interceptor: tangani 401 → refresh lalu retry
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
        return api(originalRequest);
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("expires_at");
        await SecureStore.deleteItemAsync("role");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
