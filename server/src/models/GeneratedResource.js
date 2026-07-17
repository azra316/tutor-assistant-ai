import mongoose from "mongoose";

const generatedResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [180, "Title must be 180 characters or less"],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ["worksheet", "quiz", "homework", "lessonPlan", "topicExplanation"],
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

generatedResourceSchema.index({ userId: 1, type: 1, createdAt: -1 });

export const GeneratedResource = mongoose.model("GeneratedResource", generatedResourceSchema);
