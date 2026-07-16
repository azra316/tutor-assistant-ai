import { geminiConfig } from "../config/gemini.js";
import { ApiError } from "./ApiError.js";

let client;
let GoogleGenAI;
let Type;

export async function generateGeminiJson({ prompt, schema, responseName, emptyResponseMessage }) {
  if (!geminiConfig.apiKey) {
    throw new ApiError(500, "GEMINI_API_KEY is not configured");
  }

  const { systemInstruction, contents } = normalizePrompt(prompt);

  let response;

  try {
    const geminiClient = await getClient();

    response = await geminiClient.models.generateContent({
      model: geminiConfig.model,
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: normalizeSchema(schema),
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw mapGeminiError(error);
  }

  const outputText = extractGeminiText(response);

  if (!outputText) {
    throw new ApiError(502, emptyResponseMessage);
  }

  try {
    return {
      id: response.responseId || response.id || `${responseName}-${Date.now()}`,
      data: JSON.parse(stripJsonCodeFence(outputText)),
    };
  } catch {
    throw new ApiError(502, `Gemini returned invalid ${responseName} JSON`);
  }
}

export function getGeminiModel() {
  return geminiConfig.model;
}

async function getClient() {
  if (!client) {
    if (!GoogleGenAI) {
      try {
        ({ GoogleGenAI, Type } = await import("@google/genai"));
      } catch {
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
