import mongoose from "mongoose";

const resourceGenerationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["worksheet", "quiz", "homework", "lessonPlan", "topicExplanation"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    className: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    topic: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

resourceGenerationSchema.index({ user: 1, type: 1, createdAt: -1 });

export const ResourceGeneration = mongoose.model("ResourceGeneration", resourceGenerationSchema);
