import api from "@/src/api/api";

export const getMengajar = async () => {
  const response = await api.get("/mengajar");
  return response.data;
};
