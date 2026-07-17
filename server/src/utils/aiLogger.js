export function traceAiRequest(feature) {
  return (request, _response, next) => {
    request.aiTrace = {
      feature,
      requestId: createRequestId(feature),
      startedAt: Date.now(),
    };

    logAiStep(request.aiTrace, "request received", {
      method: request.method,
      path: request.originalUrl,
      userId: request.user?._id?.toString(),
    });

    next();
  };
}

export function logAiStep(trace, step, details = {}) {
  const prefix = formatPrefix(trace);
  console.log(`${prefix} ${step}`, sanitizeDetails(details));
}

export function logAiError(trace, step, error, details = {}) {
  const prefix = formatPrefix(trace);
  console.error(`${prefix} ${step}`, {
    ...sanitizeDetails(details),
    message: error?.message,
    status: error?.status || error?.statusCode || error?.code,
    stack: error?.stack,
  });
}

function formatPrefix(trace = {}) {
  return `[ai:${trace.feature ?? "unknown"}:${trace.requestId ?? "no-trace"}]`;
}

function createRequestId(feature) {
  return `${feature}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeDetails(details) {
  return Object.fromEntries(
    Object.entries(details).filter(([key]) => !/api.?key|token|password|secret/i.test(key)),
  );
}
