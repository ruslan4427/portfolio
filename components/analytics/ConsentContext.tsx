"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getConsentState,
  isEuVisitor,
  resetConsent as resetConsentCookie,
  setConsent as setConsentCookie,
  type ConsentState,
} from "@/lib/consent";

type ConsentContextValue = {
  consent: ConsentState;
  isEu: boolean;
  mounted: boolean;
  accept: () => void;
  reject: () => void;
  reset: () => void;
  analyticsAllowed: boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>("unset");
  const [isEu, setIsEu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(getConsentState());
    setIsEu(isEuVisitor());
    setMounted(true);
  }, []);

  const accept = useCallback(() => {
    setConsentCookie("accepted");
    setConsent("accepted");
  }, []);

  const reject = useCallback(() => {
    setConsentCookie("rejected");
    setConsent("rejected");
  }, []);

  const reset = useCallback(() => {
    resetConsentCookie();
    setConsent("unset");
  }, []);

  const value = useMemo<ConsentContextValue>(() => {
    const analyticsAllowed = mounted && (consent === "accepted" || (!isEu && consent !== "rejected"));
    return { consent, isEu, mounted, accept, reject, reset, analyticsAllowed };
  }, [consent, isEu, mounted, accept, reject, reset]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}
