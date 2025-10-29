import api from "@/src/api/api";

export const getPengawasData = async (token: string, kode: string) => {
  const response = await api.post(
    "/pengawas",
    { qr_token: kode },
    {
      headers: {
        XAuthorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const postMengawas = async (token: string, id: number, qr: string) => {
  const response = await api.post(
    "/mengawas",
    { id, qr_token: qr },
    {
      headers: {
        XAuthorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
