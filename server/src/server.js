import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await connectDatabase();
    console.log(`MongoDB connected: ${connection.host}`);

    const server = app.listen(PORT, () => {
      console.log(`Tutor Assistant AI API running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing Tutor Assistant AI API...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log("Server and MongoDB connection closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error(`Unable to start Tutor Assistant AI API: ${error.message}`);
    process.exit(1);
  }
}

startServer();
