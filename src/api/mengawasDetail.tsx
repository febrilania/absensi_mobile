import api from "@/src/api/api";

export async function generateAllPresensi(token_id: string) {
  return api.post("/presensiujian", { idtoken: token_id, mode: "all" });
}

export async function updateAbsen(
  token_id: string,
  nim: string,
  status: string
) {
  return api.post("/presensiujian", {
    idtoken: token_id,
    mode: "manual",
    nim,
    status,
  });
}

export async function saveCatatan(token_id: string, catatan: string) {
  return api.post("/presensiujian", {
    idtoken: token_id,
    mode: "catatan",
    catatan,
  });
}

export async function selesaiUjian(token_id: string) {
  return api.post("/selesaiujian", { token_id });
}
