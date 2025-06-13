// Ganti nama file menjadi: server/api/auth/login.post.ts

import jwt from "jsonwebtoken";
import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return createError({
      statusCode: 400,
      statusMessage: "Email dan Password harus diisi.",
    });
  }

  // PENTING: Kode di bawah ini HANYA AKAN BERFUNGSI
  // setelah Anda berhasil menyelesaikan masalah error koneksi database dari pembahasan kita sebelumnya.
  try {
    // --- UBAH BAGIAN INI ---
    // Cari pengguna yang email DAN password-nya cocok dengan input
    const user = await prisma.user.findFirst({
      where: {
        email: email, // Email harus cocok
        password: password, // DAN Password harus cocok
      },
    });
    // --- AKHIR PERUBAHAN ---

    if (!user) {
      // Jika tidak ada kombinasi email & password yang cocok
      return createError({
        statusCode: 401,
        statusMessage: "Email atau Password Salah",
      });
    }

    // Siapkan data untuk token (tanpa password)
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const secretKey = process.env.JWT_SECRET || "kljflkawjfklwjefljoiwejf9283"; // Ambil dari .env, atau fallback (tidak disarankan)
    if (!secretKey) {
      return createError({
        statusCode: 500,
        statusMessage: "JWT Secret tidak dikonfigurasi",
      });
    }

    const token = jwt.sign(userPayload, secretKey, { expiresIn: "1h" });

    return {
      token,
      user: userPayload,
      success: true,
      statusMessage: "Login Berhasil",
    };
  } catch (error) {
    // Menangani error koneksi database dan error lainnya
    console.error("Login error:", error);
    // Jika masih error koneksi, pesan ini yang akan muncul
    return createError({
      statusCode: 500,
      statusMessage: "Terjadi kesalahan pada server",
    });
  }
});
