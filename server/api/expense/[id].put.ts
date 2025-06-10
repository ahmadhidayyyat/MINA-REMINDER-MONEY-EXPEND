// server/api/expense/[id].put.ts
import { z } from "zod";
import prisma from "~/utils/prisma";

const updateSchema = z.object({
  deskripsi: z.string().min(1),
  jumlah: z.number().positive(),
  tanggal: z.string().datetime(),
});

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const body = await readBody(event);
  const validated = updateSchema.parse(body);

  try {
    const expense = await prisma.expenses.update({
      where: { id },
      data: {
        deskripsi: validated.deskripsi,
        jumlah: validated.jumlah,
        tanggal: new Date(validated.tanggal),
      },
    });
    return expense;
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Failed to update expense",
    });
  }
});
