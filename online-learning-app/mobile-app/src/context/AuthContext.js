import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../api";
import {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  clearAllStorage,
} from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      const savedUser = await getUser();

      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login...");
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data.data;

      await saveToken(token);
      await saveUser(user);

      setUser(user);
      setIsAuthenticated(true);

      console.log("✅ Login successful:", user.email, user.role);
      return { success: true };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log("📝 Attempting registration...");
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;

      await saveToken(token);
      await saveUser(user);

      setUser(user);
      setIsAuthenticated(true);

      console.log("✅ Registration successful:", user.email, user.role);
      return { success: true };
    } catch (error) {
      console.error(
        "❌ Registration error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Logging out user:", user?.email);

      // Clear all stored data
      await clearAllStorage();

      // Reset state
      setUser(null);
      setIsAuthenticated(false);

      console.log("✅ Logout successful");
      return { success: true };
    } catch (error) {
      console.error("❌ Logout error:", error);
      return { success: false, message: "Logout failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
