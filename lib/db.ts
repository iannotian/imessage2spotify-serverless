import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAllTracks = async () => {
  return await prisma.track.findMany();
};
