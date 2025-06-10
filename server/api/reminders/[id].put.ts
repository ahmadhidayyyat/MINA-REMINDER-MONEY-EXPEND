import { z } from "zod";
import prisma from "~/utils/prisma";

const updateReminderSchema = z.object({
  judul: z.string().min(1, "Judul tidak boleh kosong"),
  priorinpty: z.string(),

  tanggal: z.string().datetime(),
});

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Reminder ID is invalid or missing",
    });
  }

  const body = await readBody(event);

  const validated = updateReminderSchema.parse(body);

  try {
    const updatedReminder = await prisma.reminder.update({
      where: {
        id: id,
      },
      data: {
        judul: validated.judul,
        priorinpty: validated.priorinpty,
        tanggal: new Date(validated.tanggal),
      },
    });

    return updatedReminder;
  } catch (error) {
    console.error(`Failed to update reminder with id ${id}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update reminder",
    });
  }
});
