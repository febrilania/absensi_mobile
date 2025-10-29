import api from "@/src/api/api";

export const getJadwalPengawas = async (token: string, qrToken: string) => {
  const response = await api.post(
    "/pengawas",
    { qr_token: qrToken },
    {
      headers: {
        "Content-Type": "application/json",
        XAuthorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const postDetailMengawas = async (
  token: string,
  id: number,
  qrToken: string
) => {
  const response = await api.post(
    "/mengawas",
    { id, qr_token: qrToken },
    {
      headers: {
        "Content-Type": "application/json",
        XAuthorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
