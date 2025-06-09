// server/api/expense/[id].delete.ts
import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);

  try {
    await prisma.expenses.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Failed to delete expense",
    });
  }
});
