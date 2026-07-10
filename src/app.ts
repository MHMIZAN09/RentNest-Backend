import cors from "cors";
import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Welcome to the RentNest API Server",
  });
});

app.use("/api/v1/auth", authRoutes);

export default app;
