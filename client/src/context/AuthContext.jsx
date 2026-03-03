import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/api";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // used for initial `/me` check
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Login response:", data);
      if (!res.ok) throw new Error(data.message || "Login failed");
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };
  

const logout = async () => {
  try {
    // 🔥 1. Logout from Firebase (Google)
    await signOut(auth);

    // 🔐 2. Logout from backend (cookie)
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    // 🧹 3. Clear app state
    setUser(null);
    setIsAuthenticated(false);
  }
};

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
    console.log("Firebase auth user:", user);
  });
    checkAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};