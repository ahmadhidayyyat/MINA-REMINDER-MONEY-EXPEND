// server/api/users.get.ts

import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    // Kembalikan error yang sesuai
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch users",
    });
  }
});
