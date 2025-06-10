import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  let userId = NaN; // Siapkan variabel userId dengan nilai awal NaN

  // --- PERBAIKAN DI SINI ---
  // Hanya proses jika 'params' ada isinya
  if (params) {
    // Ambil nama kunci pertama dari objek params (misalnya 'userId')
    const paramKey = Object.keys(params)[0];
    // Ambil nilainya dan ubah menjadi angka
    if (paramKey) {
      userId = Number(params[paramKey]);
    }
  }
  // -------------------------

  // Validasi tetap sama
  if (isNaN(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is invalid or missing from URL.",
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
