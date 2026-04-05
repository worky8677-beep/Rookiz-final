import { createContext, useContext } from "react";
import { useEyeGuard } from "../hooks/useEyeGuard";

const EyeGuardContext = createContext(null);

export function EyeGuardProvider({ children }) {
  const guard = useEyeGuard();
  return (
    <EyeGuardContext.Provider value={guard}>
      {children}
    </EyeGuardContext.Provider>
  );
}

export function useEyeGuardContext() {
  return useContext(EyeGuardContext);
}
