import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Application, Request, Response } from "express";
import APINotFound from "./app/middlewares/APINotFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";

const app = express();

const corsOptions = {
  origin: "https://blood-donation24.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send({
    Message: "Blood Donation server is running😊...",
  });
});

// Routes
app.use("/api", router);

// Error Handling
app.use(globalErrorHandler);
app.use(APINotFound);

export default app;
