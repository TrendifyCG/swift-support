"use client";

import { createContext, useContext, useReducer } from "react";
import { supportReducer } from "@/app/_context/reducer";

const SupportContext = createContext();

const initialState = {
  themeMode:
    typeof window !== "undefined"
      ? localStorage.getItem("themeMode") || "light"
      : "light",
  drawerOpen: false,
};

function SupportProvider({ children }) {
  const [state, dispatch] = useReducer(supportReducer, initialState);

  const toggleThemeMode = () => {
    const newThemeMode = state.themeMode === "dark" ? "light" : "dark";

    dispatch({ type: "TOGGLE_THEME_MODE" });
    localStorage.setItem("themeMode", newThemeMode);
  };

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_DRAWER_MODE" });
  };

  return (
    <SupportContext.Provider
      value={{ state, dispatch, toggleThemeMode, toggleDrawer }}
    >
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
