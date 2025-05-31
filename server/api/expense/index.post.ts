// server/api/expense/index.post.ts

import { z } from "zod";
import prisma from "~/utils/prisma";

const createExpenseSchema = z.object({
  deskripsi: z.string().min(1, "Deskripsi tidak boleh kosong"),
  // Perhatikan: Model Prisma Anda menggunakan 'jumlah BigInt'.
  // z.number() akan diterima dari JSON. Prisma Client akan mencoba mengonversinya.
  // Jika Anda mengirim angka yang sangat besar, pertimbangkan z.bigint() dan kirim sebagai string dari klien.
  // Untuk kebanyakan kasus pengeluaran, z.number() cukup.
  jumlah: z.number().positive("Jumlah harus angka positif"),
  tanggal: z
    .string() // Menerima string dari klien (format YYYY-MM-DD)
    .refine(
      (val) => {
        // Validasi format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(val)) return false;
        // Validasi apakah tanggalnya valid secara umum (misalnya, tidak 2023-02-30)
        const parsedDate = new Date(val);
        return !isNaN(parsedDate.getTime());
      },
      {
        message:
          "Format tanggal harus YYYY-MM-DD dan merupakan tanggal yang valid",
      }
    )
    .transform((val) => new Date(val)), // Mengubah string yang valid menjadi objek Date
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const validation = createExpenseSchema.safeParse(body);
    if (!validation.success) {
      // Mengirimkan detail error validasi dari Zod ke klien
      throw createError({
        statusCode: 400,
        statusMessage: "Input tidak valid",
        data: validation.error.format(), // Menggunakan .format() untuk struktur error yang lebih detail
      });
    }

    const { deskripsi, jumlah, tanggal } = validation.data;

    // Sesuaikan nama field dengan model Prisma 'Expenses' Anda
    const newExpense = await prisma.expenses.create({
      // Model Anda bernama 'Expenses'
      data: {
        deskripsi: deskripsi, // field di Prisma: deskripsi
        jumlah: jumlah, // field di Prisma: jumlah (Prisma akan handle number to BigInt)
        tanggal: tanggal, // field di Prisma: tanggal
        userId: 1,
      },
    });

    setResponseStatus(event, 201); // Created
    return newExpense;
  } catch (error: any) {
    console.error("Error creating expense:", error);
    if (error.statusCode === 400) {
      throw error; // Lemparkan kembali error validasi yang sudah diformat
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal membuat pengeluaran",
      // Anda bisa menyertakan detail error tambahan jika diperlukan untuk debugging
      // data: { message: error.message }
    });
  }
});
