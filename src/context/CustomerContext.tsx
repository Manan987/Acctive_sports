"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type CustomerProfile = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
};

type CustomerContextValue = {
  customer: CustomerProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  /** Open the login modal */
  login: () => void;
  /** Log out and clear session */
  logout: () => Promise<void>;
  /** Refresh customer from server (called after OTP verify) */
  refresh: () => Promise<void>;
  /** Whether the login modal is currently open */
  showLogin: boolean;
  /** Close the login modal */
  closeLogin: () => void;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/session");
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer ?? null);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hydrate on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = useCallback(() => setShowLogin(true), []);
  const closeLogin = useCallback(() => setShowLogin(false), []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/customer/session", { method: "DELETE" });
    } catch {
      // best-effort
    }
    setCustomer(null);
  }, []);

  const refresh = useCallback(async () => {
    await fetchSession();
    setShowLogin(false);
  }, [fetchSession]);

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isLoggedIn: customer !== null,
        isLoading,
        login,
        logout,
        refresh,
        showLogin,
        closeLogin,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within <CustomerProvider>");
  return ctx;
}
