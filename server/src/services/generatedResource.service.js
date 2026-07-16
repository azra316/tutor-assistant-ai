import { GeneratedResource } from "../models/GeneratedResource.js";
import { ApiError } from "../utils/ApiError.js";

export const resourceTypes = ["worksheet", "quiz", "homework", "lessonPlan", "topicExplanation"];

export function addTeacherMetadata(resource, user) {
  return {
    ...resource,
    teacherName: user.fullName,
    generatedDate: formatDisplayDate(new Date()),
  };
}

export async function saveGeneratedResource({ userId, type, resource }) {
  return GeneratedResource.create({
    title: resource.title,
    content: resource,
    type,
    userId,
  });
}

export async function listUserResources(userId, query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(24, Math.max(1, Number.parseInt(query.limit, 10) || 6));
  const skip = (page - 1) * limit;
  const filter = { userId };
  const search = typeof query.search === "string" ? query.search.trim() : "";

  if (query.type && resourceTypes.includes(query.type)) {
    filter.type = query.type;
  }

  if (search) {
    filter.title = { $regex: escapeRegex(search), $options: "i" };
  }

  const sort = buildResourceSort(query.sort);
  const [items, total] = await Promise.all([
    GeneratedResource.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("title type createdAt updatedAt")
      .lean(),
    GeneratedResource.countDocuments(filter),
  ]);

  return {
    items: items.map(toResourceSummary),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getUserResourceById(userId, resourceId) {
  const resource = await GeneratedResource.findOne({ _id: resourceId, userId }).lean();

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  return toResourceDetail(resource);
}

export async function updateUserResource(userId, resourceId, payload = {}) {
  const updates = {};

  if (typeof payload.title === "string" && payload.title.trim()) {
    updates.title = payload.title.trim();
  }

  if (payload.content && typeof payload.content === "object" && !Array.isArray(payload.content)) {
    updates.content = {
      ...payload.content,
      title: updates.title ?? payload.content.title,
    };
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "Provide a title or content to update");
  }

  const resource = await GeneratedResource.findOneAndUpdate(
    { _id: resourceId, userId },
    { $set: updates },
    { new: true, runValidators: true },
  ).lean();

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  return toResourceDetail(resource);
}

export async function deleteUserResource(userId, resourceId) {
  const result = await GeneratedResource.deleteOne({ _id: resourceId, userId });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "Resource not found");
  }
}

export async function duplicateUserResource(userId, resourceId) {
  const resource = await GeneratedResource.findOne({ _id: resourceId, userId }).lean();

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  const copyTitle = `Copy of ${resource.title}`;
  const copyContent =
    resource.content && typeof resource.content === "object"
      ? { ...resource.content, title: copyTitle }
      : resource.content;

  const duplicated = await GeneratedResource.create({
    title: copyTitle,
    content: copyContent,
    type: resource.type,
    userId,
  });

  return toResourceDetail(duplicated.toObject());
}

export async function getUserGenerationStats(userId) {
  const groupedCounts = await GeneratedResource.aggregate([
    {
      $match: {
        userId,
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

function buildResourceSort(sort) {
  const sorts = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    titleAsc: { title: 1 },
    titleDesc: { title: -1 },
    updated: { updatedAt: -1 },
  };

  return sorts[sort] ?? sorts.newest;
}

function toResourceSummary(resource) {
  return {
    id: resource._id.toString(),
    title: resource.title,
    type: resource.type,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
}

function toResourceDetail(resource) {
  return {
    ...toResourceSummary(resource),
    content: resource.content,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
