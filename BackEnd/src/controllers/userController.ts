import prisma from "../db/client";

export const upsertUser = async (googleProfile: { username: string; email?: string }) => {
  const { username, email } = googleProfile;

  if (!email) {
    throw new Error("Email is required for upsert");
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { username },
    create: { username, email },
  });

  return user;
};
