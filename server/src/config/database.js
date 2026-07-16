let mongooseInstance;

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  const mongoose = await getMongoose();

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

export async function disconnectDatabase() {
  if (!mongooseInstance) {
    return;
  }

  await mongooseInstance.disconnect();
}

async function getMongoose() {
  if (!mongooseInstance) {
    try {
      mongooseInstance = (await import("mongoose")).default;
    } catch {
      throw new Error("Mongoose is not installed. Run npm install in the server directory.");
    }
  }

  return mongooseInstance;
}
