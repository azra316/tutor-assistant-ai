import { ApiError } from "../utils/ApiError.js";

const requiredStringFields = ["class", "subject", "topic", "difficulty"];

export function validateQuizRequest(request, _response, next) {
  const body = request.body ?? {};
  const errors = [];

  for (const field of requiredStringFields) {
    if (typeof body[field] !== "string" || body[field].trim().length === 0) {
      errors.push(`${field} is required`);
    }
  }

  if (!Number.isInteger(body.numberOfQuestions)) {
    errors.push("numberOfQuestions must be an integer");
  } else if (body.numberOfQuestions < 4 || body.numberOfQuestions > 40) {
    errors.push("numberOfQuestions must be between 4 and 40");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Invalid quiz request", errors));
  }

  request.validatedBody = {
    class: body.class.trim(),
    subject: body.subject.trim(),
    topic: body.topic.trim(),
    difficulty: body.difficulty.trim(),
    numberOfQuestions: body.numberOfQuestions,
  };

  return next();
}
