import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Buat instance axios
const api = axios.create({
  baseURL: "https://sim.peradaban.ac.id/wp-json/simbaru/v1",
  headers: { "Content-Type": "application/json" },
});

// Tambahkan interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kalau error 401 (unauthorized) dan belum dicoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        if (!refreshToken) {
          throw new Error("Refresh token tidak ada");
        }

        // Panggil endpoint refresh
        const res = await axios.post(
          "https://sim.peradaban.ac.id/wp-json/simbaru/v1/refresh",
          { refresh_token: refreshToken }
        );

        const newAccessToken = res.data?.token;
        if (newAccessToken) {
          // Simpan token baru
          await SecureStore.setItemAsync("token", newAccessToken);

          // Update header request lama
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Ulangi request lama dengan token baru
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Gagal refresh token:", refreshError);
        // kalau gagal refresh → logout user
      }
    }

    return Promise.reject(error);
  }
);

export default api;
