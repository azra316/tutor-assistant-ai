import { ResourceGeneration } from "../models/ResourceGeneration.js";

export function addTeacherMetadata(resource, user) {
  return {
    ...resource,
    teacherName: user.fullName,
    generatedDate: formatDisplayDate(new Date()),
  };
}

export async function recordGeneration({ userId, type, resource, request }) {
  await ResourceGeneration.create({
    user: userId,
    type,
    title: resource.title,
    className: resource.class ?? request.class ?? "",
    subject: resource.subject ?? request.subject ?? "",
    topic: resource.topic ?? request.topic ?? "",
  });
}

export async function getUserGenerationStats(userId) {
  const groupedCounts = await ResourceGeneration.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = {
    totalWorksheets: 0,
    totalQuizzes: 0,
    totalHomework: 0,
    totalLessonPlans: 0,
    totalTopicExplanations: 0,
  };

  for (const item of groupedCounts) {
    if (item._id === "worksheet") stats.totalWorksheets = item.count;
    if (item._id === "quiz") stats.totalQuizzes = item.count;
    if (item._id === "homework") stats.totalHomework = item.count;
    if (item._id === "lessonPlan") stats.totalLessonPlans = item.count;
    if (item._id === "topicExplanation") stats.totalTopicExplanations = item.count;
  }

  return stats;
}

function formatDisplayDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
