import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import client from "../api/client";
import type { AuthResponse } from "../types";

interface AuthUser {
  id: number;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): AuthUser | null {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser());

  function persist(res: AuthResponse) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify({ id: res.id, email: res.email }));
    setUser({ id: res.id, email: res.email });
  }

  async function login(email: string, password: string) {
    const res = await client.post<AuthResponse>("/auth/login", { email, password });
    persist(res.data);
  }

  async function register(email: string, password: string) {
    const res = await client.post<AuthResponse>("/auth/register", { email, password });
    persist(res.data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
