import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  // PERBAIKAN FINAL: Membaca parameter 'id' dari URL, sama persis seperti file expense
  const userId = Number(event.context.params?.id);

  // Validasi untuk memastikan userId ada dan merupakan angka
  if (!userId || isNaN(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is invalid or missing",
    });
  }

  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        tanggal: "desc",
      },
    });

    return reminders;
  } catch (error) {
    console.error("Failed to fetch reminders:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch reminders",
    });
  }
});
