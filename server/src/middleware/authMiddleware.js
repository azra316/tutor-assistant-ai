import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAuthToken } from "../utils/jwt.js";

export async function requireAuth(request, _response, next) {
  try {
    const authHeader = request.headers.authorization;
    const cookieToken = getCookieValue(request.headers.cookie, "auth_token");

    if (!authHeader?.startsWith("Bearer ") && !cookieToken) {
      throw new ApiError(401, "Authentication token is required");
    }

    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : cookieToken;
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new ApiError(401, "User account no longer exists");
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function getCookieValue(cookieHeader, cookieName) {
  if (!cookieHeader) {
    return "";
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const target = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));

  return target ? decodeURIComponent(target.split("=").slice(1).join("=")) : "";
}
