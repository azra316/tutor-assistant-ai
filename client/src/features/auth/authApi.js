import { requestJson } from "../apiClient";

export async function registerUser(payload) {
  return requestJson(
    "/api/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    { fallbackMessage: "Registration failed." },
  );
}

export async function loginUser(payload) {
  return requestJson(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    { fallbackMessage: "Login failed." },
  );
}

export async function logoutUser() {
  return requestJson(
    "/api/auth/logout",
    {
      method: "POST",
    },
    { fallbackMessage: "Logout failed." },
  );
}

export async function fetchCurrentUser() {
  return requestJson(
    "/api/auth/me",
    {
      method: "GET",
    },
    { fallbackMessage: "Could not fetch current user." },
  );
}
