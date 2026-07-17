import { geminiConfig } from "../config/gemini.js";
import { ApiError } from "./ApiError.js";
import { logAiError, logAiStep } from "./aiLogger.js";

let client;
let GoogleGenAI;
let Type;

export async function generateGeminiJson({ prompt, schema, responseName, emptyResponseMessage, trace }) {
  logAiStep(trace, "Gemini client entered");

  if (!geminiConfig.apiKey) {
    const error = new ApiError(500, "GEMINI_API_KEY is not configured");
    logAiError(trace, "Gemini configuration error", error);
    throw error;
  }

  if (!geminiConfig.model) {
    const error = new ApiError(500, "GEMINI_MODEL is not configured");
    logAiError(trace, "Gemini configuration error", error);
    throw error;
  }

  const { systemInstruction, contents } = normalizePrompt(prompt);

  let response;

  try {
    const geminiClient = await getClient();
    const normalizedSchema = normalizeSchema(schema);

    logAiStep(trace, "Gemini request started", {
      model: geminiConfig.model,
      responseName,
      hasSystemInstruction: Boolean(systemInstruction),
      contentLength: contents.length,
      schemaProperties: Object.keys(normalizedSchema?.properties ?? {}),
    });

    response = await geminiClient.models.generateContent({
      model: geminiConfig.model,
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: normalizedSchema,
      },
    });

    logAiStep(trace, "Gemini response received", {
      responseId: response?.responseId || response?.id,
      hasText: typeof response?.text === "string" && response.text.trim().length > 0,
      candidates: response?.candidates?.length ?? 0,
    });
  } catch (error) {
    logAiError(trace, "Gemini SDK threw exception", error, {
      model: geminiConfig.model,
      responseName,
      rawMessage: extractGeminiErrorMessage(error),
    });

    if (error instanceof ApiError) {
      throw error;
    }

    throw mapGeminiError(error);
  }

  const outputText = extractGeminiText(response);

  if (!outputText) {
    const error = new ApiError(502, emptyResponseMessage);
    logAiError(trace, "Gemini returned empty text", error);
    throw error;
  }

  try {
    return {
      id: response.responseId || response.id || `${responseName}-${Date.now()}`,
      data: JSON.parse(stripJsonCodeFence(outputText)),
    };
  } catch (error) {
    const apiError = new ApiError(502, `Gemini returned invalid ${responseName} JSON`);
    logAiError(trace, "Gemini returned invalid JSON", error, {
      responseName,
      outputPreview: outputText.slice(0, 500),
    });
    throw apiError;
  }
}

export function getGeminiModel() {
  return geminiConfig.model;
}

async function getClient() {
  if (!client) {
    if (!GoogleGenAI) {
      try {
        logAiStep(undefined, "importing @google/genai SDK");
        ({ GoogleGenAI, Type } = await import("@google/genai"));
        logAiStep(undefined, "@google/genai SDK imported", {
          hasGoogleGenAI: Boolean(GoogleGenAI),
          hasTypeEnum: Boolean(Type),
        });
      } catch (error) {
        logAiError(undefined, "@google/genai SDK import failed", error);
        throw new ApiError(
          500,
          "Google Gen AI SDK is not installed. Run npm install in the server directory.",
        );
      }
    }

    client = new GoogleGenAI({ apiKey: geminiConfig.apiKey });
  }

  return client;
}

function normalizePrompt(prompt) {
  if (!Array.isArray(prompt)) {
    return {
      systemInstruction: "",
      contents: String(prompt || ""),
    };
  }

  const systemInstruction = prompt
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");

  const contents = prompt
    .filter((message) => message.role !== "system")
    .map((message) => message.content)
    .join("\n\n");

  return {
    systemInstruction,
    contents,
  };
}

function normalizeSchema(schema) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map(normalizeSchema);
  }

  const normalized = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === "additionalProperties") {
      continue;
    }

    if (key === "type" && typeof value === "string") {
      normalized.type = toGeminiType(value);
      continue;
    }

    normalized[key] = normalizeSchema(value);
  }

  if (normalized.properties && !normalized.propertyOrdering) {
    normalized.propertyOrdering = Object.keys(normalized.properties);
  }

  return normalized;
}

function toGeminiType(type) {
  const typeKey = type.toUpperCase();
  return Type?.[typeKey] || typeKey;
}

function extractGeminiText(response) {
  if (typeof response?.text === "string") {
    return response.text.trim();
  }

  const candidates = response?.candidates ?? [];
  const text = candidates
    .flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text)
    .filter(Boolean)
    .join("");

  return text.trim();
}

function stripJsonCodeFence(value) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function mapGeminiError(error) {
  const statusCode = Number(error?.status || error?.statusCode || error?.code);
  const message = extractGeminiErrorMessage(error);

  if (statusCode === 401 || statusCode === 403 || /api[_\s-]?key|api key not valid/i.test(message)) {
    return new ApiError(401, "Gemini API key is invalid or unauthorized");
  }

  if (statusCode === 429) {
    return new ApiError(429, "Gemini rate limit exceeded. Try again later.");
  }

  if (statusCode === 400 && /model/i.test(message)) {
    return new ApiError(400, "GEMINI_MODEL is invalid or not available");
  }

  if (
    error instanceof TypeError ||
    /fetch failed|network|ENOTFOUND|ECONNRESET|ETIMEDOUT|ECONNREFUSED/i.test(message)
  ) {
    return new ApiError(503, "Unable to reach Gemini. Check the backend network connection.");
  }

  if (statusCode >= 400 && statusCode < 500) {
    return new ApiError(statusCode, message || "Gemini rejected the request");
  }

  return new ApiError(502, message || "Gemini was unable to generate a response");
}

function extractGeminiErrorMessage(error) {
  const rawMessage = String(error?.message || "");

  try {
    const parsed = JSON.parse(rawMessage);
    return parsed?.error?.message || rawMessage;
  } catch {
    return rawMessage;
  }
}
