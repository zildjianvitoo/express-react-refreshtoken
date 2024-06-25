import { db } from "./db";

async function main() {
  try {
    await db.user.create({
      data: {
        email: "kocak@gmail.com",
        password: "goblokk!212",
        name: "Vito",
        refresh_token: "sasas",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

main();
