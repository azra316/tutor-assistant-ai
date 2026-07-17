import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from "./authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        const result = await fetchCurrentUser();
        if (isMounted) {
          setUser(result.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  async function register(payload) {
    const result = await registerUser(payload);
    setUser(result.user);
    return result.user;
  }

  async function login(payload) {
    const result = await loginUser(payload);
    setUser(result.user);
    return result.user;
  }

  async function logout() {
    try {
      await logoutUser();
    } catch {
      // Clear local auth state even if the server is unreachable.
    } finally {
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      register,
      login,
      logout,
    }),
    [user, isAuthLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
