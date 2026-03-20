/**
 * context/AnalysisContext.tsx
 *
 * Permet à _layout.tsx (TabBar) de déclencher une analyse
 * définie dans n'importe quelle page (ex: index.tsx).
 */

import React, { createContext, useContext, useRef, useCallback } from 'react';

interface AnalysisContextValue {
  /** Enregistre le handler de la page active */
  registerHandler: (fn: (url: string) => void) => void;
  /** Désenregistre le handler */
  unregisterHandler: () => void;
  /** Appelé par la TabBar pour lancer une analyse */
  triggerAnalysis: (url: string) => void;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const handlerRef = useRef<((url: string) => void) | null>(null);

  const registerHandler = useCallback((fn: (url: string) => void) => {
    handlerRef.current = fn;
  }, []);

  const unregisterHandler = useCallback(() => {
    handlerRef.current = null;
  }, []);

  const triggerAnalysis = useCallback((url: string) => {
    handlerRef.current?.(url);
  }, []);

  return (
    <AnalysisContext.Provider value={{ registerHandler, unregisterHandler, triggerAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used inside AnalysisProvider');
  return ctx;
}
