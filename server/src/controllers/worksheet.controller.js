import { createWorksheet } from "../services/worksheet.service.js";

export async function generateWorksheet(request, response, next) {
  try {
    const worksheet = await createWorksheet(request.validatedBody);

    response.status(200).json({
      success: true,
      data: worksheet,
    });
  } catch (error) {
    next(error);
  }
}
