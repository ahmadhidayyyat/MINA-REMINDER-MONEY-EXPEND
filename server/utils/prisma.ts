import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Satu instance aja

prisma
  .$connect()
  .then(() => {
    console.log("Database connected, bro!");
  })
  .catch((error) => {
    console.error("Gagal connect ke database:", error);
  });

export default prisma;
