import express from "express";
import cors from "cors";
import worksheetRoutes from "./routes/worksheet.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import homeworkRoutes from "./routes/homework.routes.js";
import lessonPlanRoutes from "./routes/lessonPlan.routes.js";
import topicExplainerRoutes from "./routes/topicExplainer.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",")
      .map((origin) => origin.trim().replace(/\/+$/, ""))
      .filter(Boolean)
  : [];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.length === 0 && process.env.NODE_ENV !== "production") {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "Tutor Assistant AI API",
  });
});

app.use("/", worksheetRoutes);
app.use("/", quizRoutes);
app.use("/", homeworkRoutes);
app.use("/", lessonPlanRoutes);
app.use("/", topicExplainerRoutes);
app.use(errorHandler);

export default app;
