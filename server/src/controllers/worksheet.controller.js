import { createWorksheet } from "../services/worksheet.service.js";
import {
  addTeacherMetadata,
  recordGeneration,
} from "../services/resourceGeneration.service.js";

export async function generateWorksheet(request, response, next) {
  try {
    const worksheet = addTeacherMetadata(await createWorksheet(request.validatedBody), request.user);

    await recordGeneration({
      userId: request.user._id,
      type: "worksheet",
      resource: worksheet,
      request: request.validatedBody,
    });

    response.status(200).json({
      success: true,
      data: worksheet,
    });
  } catch (error) {
    next(error);
  }
}
