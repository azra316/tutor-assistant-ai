export function errorHandler(error, _request, response, _next) {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode;

  response.status(statusCode).json({
    success: false,
    message: normalizedError.message,
    errors: normalizedError.errors,
  });
}

function normalizeError(error) {
  if (error?.type === "entity.parse.failed") {
    return {
      statusCode: 400,
      message: "Request body contains invalid JSON",
      errors: [],
    };
  }

  if (error?.name === "ValidationError") {
    return {
      statusCode: 400,
      message: "Validation failed",
      errors: Object.values(error.errors ?? {}).map((item) => item.message),
    };
  }

  if (error?.name === "CastError") {
    return {
      statusCode: 400,
      message: "Invalid resource identifier",
      errors: [],
    };
  }

  if (error?.code === 11000) {
    return {
      statusCode: 409,
      message: "Duplicate record",
      errors: [],
    };
  }

  const statusCode = Number(error?.statusCode || error?.status || 500);
  const isServerError = statusCode >= 500;

  return {
    statusCode,
    message: isServerError ? "Internal server error" : error?.message || "Request failed",
    errors: Array.isArray(error?.errors) ? error.errors : [],
  };
}
