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
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
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
