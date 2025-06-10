// server/api/expense/index.post.ts

import { z } from "zod";
import prisma from "~/utils/prisma";

const createExpenseSchema = z.object({
  userId: z.number(),
  deskripsi: z.string().min(1, "Deskripsi tidak boleh kosong"),

  jumlah: z.number().positive("Jumlah harus angka positif"),
  tanggal: z
    .string()
    .refine(
      (val) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(val)) return false;

        const parsedDate = new Date(val);
        return !isNaN(parsedDate.getTime());
      },
      {
        message:
          "Format tanggal harus YYYY-MM-DD dan merupakan tanggal yang valid",
      }
    )
    .transform((val) => new Date(val)),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const validation = createExpenseSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Input tidak valid",
        data: validation.error.format(),
      });
    }

    const { deskripsi, jumlah, tanggal, userId } = validation.data;

    const newExpense = await prisma.expenses.create({
      data: {
        deskripsi,
        jumlah,
        tanggal,
        userId,
      },
    });

    setResponseStatus(event, 201);
    return newExpense;
  } catch (error: any) {
    console.error("Error creating expense:", error);
    if (error.statusCode === 400) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Eror creating expense",
    });
  }
});
