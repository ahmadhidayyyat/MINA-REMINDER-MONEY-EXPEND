import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  const userId = Number(event.context.params?.id);

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  try {
    const expenses = await prisma.expenses.findMany({
      where: { userId },
      orderBy: { tanggal: "desc" },
    });

    return expenses;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch expenses",
    });
  }
});
