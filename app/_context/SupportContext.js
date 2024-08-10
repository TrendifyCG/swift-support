"use client";

import { createContext, useContext, useReducer } from "react";
import { supportReducer } from "@/app/_context/reducer";

const SupportContext = createContext();

const initialState = {
  themeMode:
    typeof window !== "undefined"
      ? localStorage.getItem("themeMode") || "light"
      : "light",
};

function SupportProvider({ children }) {
  const [state, dispatch] = useReducer(supportReducer, initialState);

  const toggleThemeMode = () => {
    const newThemeMode = state.themeMode === "dark" ? "light" : "dark";

    dispatch({ type: "TOGGLE_THEME_MODE" });
    localStorage.setItem("themeMode", newThemeMode);
  };

  return (
    <SupportContext.Provider value={{ state, dispatch, toggleThemeMode }}>
      {children}
    </SupportContext.Provider>
  );
}

function useSupport() {
  const context = useContext(SupportContext);

  if (!context) {
    throw new Error("useSupport must be used within an SupportProvider");
  }

  return context;
}

export { SupportProvider, useSupport };
