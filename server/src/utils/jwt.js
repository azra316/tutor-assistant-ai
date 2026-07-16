import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

const DEFAULT_EXPIRES_IN = "7d";

export function signAuthToken(userId) {
  const secret = getJwtSecret();

  return jwt.sign({ sub: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN,
  });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    throw new ApiError(401, "Invalid or expired authentication token");
  }
}

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
}
