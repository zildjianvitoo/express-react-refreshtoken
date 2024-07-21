import { Request, Response } from "express";
import { db } from "../../prisma/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getAllUser(req: Request, res: Response) {
  try {
    const user = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
}

export async function doRegister(req: Request, res: Response) {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password dan Confirm Password tidak cocok" });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
    res.json({ message: "Register Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

export async function doLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  console.log({ email, password });
  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password tidak cocok",
      });
    }

    const { id: userId, name, email: userEmail } = user;

    const accessToken = jwt.sign(
      { userId, name, userEmail },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      { userId, name, userEmail },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    await db.user.update({
      data: {
        refresh_token: refreshToken,
      },
      where: {
        id: userId,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: accessToken });
  } catch (error) {
    console.log(error);
  }
}

export async function doLogout(req: Request, res: Response) {
  const refreshToken: string = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(204);
  }

  const user = await db.user.findUnique({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user) {
    return res.sendStatus(204);
  }

  const { id: userId } = user;

  await db.user.update({
    data: {
      refresh_token: null,
    },
    where: {
      id: userId,
    },
  });

  res.clearCookie("refreshToken");

  return res.sendStatus(200);
}
