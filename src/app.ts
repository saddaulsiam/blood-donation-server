import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";
import APINotFound from "./app/middlewares/APINotFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";

const app = express();

// const allowedOrigins = ["https://blood-donation24.vercel.app", "http://localhost:3000"];
/*  (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  } ,*/

const corsOptions: CorsOptions = {
  origin: ["https://blood-donation24.netlify.app"],
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
