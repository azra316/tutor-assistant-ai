import { ApiError } from "../utils/ApiError.js";

const requiredStringFields = ["class", "subject", "topic"];

export function validateHomeworkRequest(request, _response, next) {
  const body = request.body ?? {};
  const errors = [];

  for (const field of requiredStringFields) {
    if (typeof body[field] !== "string" || body[field].trim().length === 0) {
      errors.push(`${field} is required`);
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Invalid homework request", errors));
  }

  request.validatedBody = {
    class: body.class.trim(),
    subject: body.subject.trim(),
    topic: body.topic.trim(),
  };

  return next();
}
