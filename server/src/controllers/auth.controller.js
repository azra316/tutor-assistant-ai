import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signAuthToken } from "../utils/jwt.js";

export async function register(request, response, next) {
  try {
    const { fullName, email, password } = request.body;

    if (!fullName?.trim() || !email?.trim() || !password) {
      throw new ApiError(400, "Full name, email, and password are required");
    }

    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    }

    if (password.length > 128) {
      throw new ApiError(400, "Password must be 128 characters or less");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    });
    const token = signAuthToken(user._id.toString());

    setAuthCookie(response, token);

    response.status(201).json({
      success: true,
      message: "Registration successful",
      user: user.toSafeObject(),
    });
  } catch (error) {
    if (error.code === 11000) {
      next(new ApiError(409, "An account with this email already exists"));
      return;
    }

    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    if (!email?.trim() || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    if (password.length > 128) {
      throw new ApiError(400, "Invalid email or password");
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signAuthToken(user._id.toString());

    setAuthCookie(response, token);

    response.status(200).json({
      success: true,
      message: "Login successful",
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
}

export function logout(_request, response) {
  clearAuthCookie(response);

  response.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

export function me(request, response) {
  response.status(200).json({
    success: true,
    user: request.user.toSafeObject(),
  });
}

function setAuthCookie(response, token) {
  response.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearAuthCookie(response) {
  response.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
}
