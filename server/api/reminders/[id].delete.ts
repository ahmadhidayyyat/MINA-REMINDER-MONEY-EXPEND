import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Reminder ID is invalid or missing",
    });
  }

  try {
    await prisma.reminder.delete({
      where: { id },
    });

    return {
      success: true,
      message: `Reminder with id ${id} has been deleted.`,
    };
  } catch (error) {
    console.error(`Failed to delete reminder with id ${id}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete reminder",
    });
  }
});
