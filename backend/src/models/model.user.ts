import { db } from "../../prisma/db";

export async function getAllUser() {
  const user = await db.user.findMany();
  return user;
}
