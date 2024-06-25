import express from "express";
import dotenv from "dotenv";
import { router } from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const port = 5000;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

app.get("/", async (req, res) => {
  res.send("Halo express");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
