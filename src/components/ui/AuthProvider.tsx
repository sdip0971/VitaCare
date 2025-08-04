"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/types";
interface AuthContextType {
  user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;

}
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

const login = async () => {
  try {
    const response = await fetch("/api/user/current");
    const data = await response.json();
    setUser(data.user || null);
  } catch (error) {
    console.error("Login error:", error);
    setUser(null);
  }
};
  
  const logout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    setUser(null);
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    login(); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
