import { getUserGenerationStats } from "../services/resourceGeneration.service.js";

export async function getDashboardStats(request, response, next) {
  try {
    const stats = await getUserGenerationStats(request.user._id);

    response.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}
