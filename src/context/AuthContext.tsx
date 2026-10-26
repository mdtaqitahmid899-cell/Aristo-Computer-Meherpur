"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export const ADMIN_PASSWORD = "meherpur123";
const ADMIN_STORAGE_KEY = "aristo_admin_unlocked";
const AUTH_EVENT_NAME = "aristo_admin_auth_changed";

export interface AdminUser {
  email: string;
  uid: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (passwordOrEmail: string, optionalPassword?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: false,
  error: null,
  login: async () => false,
  logout: () => {},
  clearError: () => {},
  isFirebaseActive: false,
});

function subscribeToAuth(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT_NAME, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT_NAME, callback);
  };
}

function getAuthSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      localStorage.getItem(ADMIN_STORAGE_KEY) === "true" ||
      sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true"
    );
  } catch {
    return false;
  }
}

function getAuthServerSnapshot(): boolean {
  return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Synchronize with external storage without cascading renders
  const isUnlocked = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFirebaseActive = isFirebaseConfigured();

  const user: AdminUser | null = isUnlocked
    ? {
        email: "admin@aristocomputer.com",
        uid: "aristo-admin",
        role: "Store Admin",
      }
    : null;

  const login = useCallback(
    async (passwordOrEmail: string, optionalPassword?: string): Promise<boolean> => {
      setError(null);
      setSubmitting(true);

      const inputPasscode = (
        optionalPassword !== undefined ? optionalPassword : passwordOrEmail
      ).trim();

      if (inputPasscode === ADMIN_PASSWORD) {
        try {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
            localStorage.setItem(ADMIN_STORAGE_KEY, "true");
            window.dispatchEvent(new Event(AUTH_EVENT_NAME));
          }
        } catch (e) {
          console.warn("Could not persist admin session:", e);
        }

        setSubmitting(false);
        return true;
      }

      setError("Incorrect password. Please enter the valid admin passcode.");
      setSubmitting(false);
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setError(null);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        window.dispatchEvent(new Event(AUTH_EVENT_NAME));
      }
    } catch (e) {
      console.warn("Could not clear admin session:", e);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: isUnlocked,
        loading: submitting,
        error,
        login,
        logout,
        clearError,
        isFirebaseActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
