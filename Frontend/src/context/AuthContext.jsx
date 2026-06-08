/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("delishdrop_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading] = useState(false);

  const loginUser = (userData, token) => {
    if (!userData || !token) return;
    localStorage.setItem("delishdrop_user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("delishdrop_user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // ✅ Update user in localStorage + state
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem("delishdrop_user", JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{
      user, loginUser, logoutUser, updateUser, loading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);