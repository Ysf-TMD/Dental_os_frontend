"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useMe, useLogin, useRegister, useLogout } from "@/lib/hooks/use-auth";
import type {
  LoginInput,
  RegisterInput,
} from "@/features/auth/schemas/auth-schema";
import type { User } from "@/features/auth/types";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // Listen for 401s from the ApiService interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      router.push("/login");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [router]);

  const login = async (credentials: LoginInput) => {
    await loginMutation.mutateAsync(credentials);
    router.push("/");
  };

  const register = async (data: RegisterInput) => {
    await registerMutation.mutateAsync(data);
    router.push("/");
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    localStorage.clear();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
