import { createHomework } from "../services/homework.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";

export async function generateHomework(request, response, next) {
  try {
    const homework = addTeacherMetadata(await createHomework(request.validatedBody), request.user);

    await saveGeneratedResource({
      userId: request.user._id,
      type: "homework",
      resource: homework,
    });

    response.status(200).json({
      success: true,
      data: homework,
    });
  } catch (error) {
    next(error);
  }
}
