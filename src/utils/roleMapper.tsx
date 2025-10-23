export function getAppRole(
  role: string
): "mahasiswa" | "dosen" | "karyawan" | "unknown" {
  if (!role) return "unknown";

  // 🔹 Mahasiswa
  if (role === "um_mahasiswa") return "mahasiswa";

  // 🔹 Dosen
  if (role === "um_dosen") return "dosen";

  // 🔹 Semua role lain dianggap Karyawan
  const karyawanRoles = [
    "um_admin",
    "um_adminuniv",
    "um_adminfst",
    "um_adminfkip",
    "um_adminfisip",
    "um_adminfeb",
    "um_karyawan",
    "um_keuangan",
    "um_pengadaan-barang",
    "um_sarpras",
    "um_perpustakaan",
    "um_kemahasiswaan",
    "um_lppm",
    "um_hrd",
    "um_ujian",
  ];

  if (karyawanRoles.includes(role)) return "karyawan";

  // fallback kalau ada role baru yang belum dikenal
  return "unknown";
}
