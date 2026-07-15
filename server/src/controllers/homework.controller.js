import { createHomework } from "../services/homework.service.js";

export async function generateHomework(request, response, next) {
  try {
    const homework = await createHomework(request.validatedBody);

    response.status(200).json({
      success: true,
      data: homework,
    });
  } catch (error) {
    next(error);
  }
}
