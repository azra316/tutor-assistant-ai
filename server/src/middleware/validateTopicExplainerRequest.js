import { ApiError } from "../utils/ApiError.js";

const requiredStringFields = ["topic", "class"];
const MAX_FIELD_LENGTH = 160;

export function validateTopicExplainerRequest(request, _response, next) {
  const body = request.body ?? {};
  const errors = [];

  for (const field of requiredStringFields) {
    if (typeof body[field] !== "string" || body[field].trim().length === 0) {
      errors.push(`${field} is required`);
    } else if (body[field].trim().length > MAX_FIELD_LENGTH) {
      errors.push(`${field} must be ${MAX_FIELD_LENGTH} characters or less`);
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Invalid topic explainer request", errors));
  }

  request.validatedBody = {
    topic: body.topic.trim(),
    class: body.class.trim(),
  };

  return next();
}
