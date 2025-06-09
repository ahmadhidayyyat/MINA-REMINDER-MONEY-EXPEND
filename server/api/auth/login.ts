// server/api/generate-token.js

import jwt from "jsonwebtoken";
import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Mengambil data dari request body

  const { email, password } = body;

  if (!email || !password) {
    return {
      user: null,
      token: "",
      success: false,
      statusCode: 400,
      statusMessage: "Email and Password are required.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return {
      user: null,
      token: "",
      success: false,
      statusCode: 401,
      statusMessage: "Email Or Password is Wrong",
    };
  }

  const secretKey = "kljflkawjfklwjefljoiwejf9283"; // JWT_SECRET yang didefinisikan di nuxt.config.ts

  // Setel waktu kedaluwarsa token (misalnya 1 jam)
  const expiresIn = "1h";

  // Generate JWT
  const token = jwt.sign(user, secretKey, { expiresIn });

  // Return token sebagai response
  return {
    token,
    user,
    statusCode: 200,
    statusMessage: "Berhasil Login",
    success: true,
  };
});
