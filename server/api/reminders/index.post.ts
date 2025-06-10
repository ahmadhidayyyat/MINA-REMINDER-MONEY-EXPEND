import { z } from "zod";
import prisma from "~/utils/prisma";

// Skema validasi sekarang mewajibkan semua kolom diisi
const createReminderSchema = z.object({
  userId: z.number(),
  judul: z.string().min(1, "Judul tidak boleh kosong"),
  priorinpty: z.string(),

  tanggal: z.string().datetime("Tanggal harus diisi dan formatnya benar"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const validation = createReminderSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Input tidak valid",
        data: validation.error.format(),
      });
    }

    const { judul, priorinpty, tanggal, userId } = validation.data;

    const newReminder = await prisma.reminder.create({
      data: {
        judul,
        priorinpty,

        tanggal: new Date(tanggal),
        userId,
      },
    });

    setResponseStatus(event, 201);
    return newReminder;
  } catch (error: any) {
    console.error("Error creating reminder:", error);
    if (error.statusCode === 400) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal membuat reminder",
    });
  }
});
