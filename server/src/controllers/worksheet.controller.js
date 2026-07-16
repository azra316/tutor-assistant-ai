import { createWorksheet } from "../services/worksheet.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";

export async function generateWorksheet(request, response, next) {
  try {
    const worksheet = addTeacherMetadata(await createWorksheet(request.validatedBody), request.user);

    await saveGeneratedResource({
      userId: request.user._id,
      type: "worksheet",
      resource: worksheet,
    });

    response.status(200).json({
      success: true,
      data: worksheet,
    });
  } catch (error) {
    next(error);
  }
}
