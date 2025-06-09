// server/api/auth/register.js

import { PrismaClient } from "@prisma/client";
import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Mengambil data dari request body

  const { email, password, name } = body;

  // Validasi input (misalnya pastikan email dan password ada)
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and Password are required.",
    });
  }

  // Cek apakah email sudah digunakan
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is already registered.",
    });
  }

  // Tambahkan user ke dalam database
  const user = await prisma.user.create({
    data: {
      email,
      password, // Pastikan password sudah di-hash sebelumnya, jangan simpan plain text password
      name,
    },
  });

  console.log(user);

  return {
    success: true,
  };
});
