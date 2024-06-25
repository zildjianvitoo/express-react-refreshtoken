import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { db } from "../../prisma/db";

export async function refreshToken(req: Request, res: Response) {
  try {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const user = await db.user.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (error, decode) => {
        if (error) {
          return res.sendStatus(403);
        }
      }
    );

    const { id: userId, name, email } = user;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "20s",
      }
    );

    res.json({ accessToken: accessToken });
  } catch (error) {
    console.log(error);
  }
}
