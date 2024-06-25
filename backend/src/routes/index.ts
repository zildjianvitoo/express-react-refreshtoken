import express from "express";
import {
  doLogin,
  doLogout,
  doRegister,
  getAllUser,
} from "../controller/user.controller";
import { verifyToken } from "../../middleware/verifyToken";

import { refreshToken } from "../controller/refreshtoken.controller";

export const router = express.Router();

router.get("/users", verifyToken, getAllUser);
router.post("/users", doRegister);
router.post("/users/login", doLogin);
router.get("/token", refreshToken);
router.delete("/users/logout", doLogout);
