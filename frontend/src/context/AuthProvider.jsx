import { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/auth.api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ; (async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials);
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerUser(data);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    loading,
    login,
    register,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}