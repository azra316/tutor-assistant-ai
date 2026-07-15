import { createLessonPlan } from "../services/lessonPlan.service.js";

export async function generateLessonPlan(request, response, next) {
  try {
    const lessonPlan = await createLessonPlan(request.validatedBody);

    response.status(200).json({
      success: true,
      data: lessonPlan,
    });
  } catch (error) {
    next(error);
  }
}
