"use client";

import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import getLPTheme from "@/app/_components/getLPTheme";
import { useSupport } from "@/app/_context/SupportContext";

function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);
  const { state } = useSupport();
  const LPtheme = createTheme(getLPTheme(state.themeMode));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <ThemeProvider theme={LPtheme}>{children}</ThemeProvider>;
}

export default ClientOnly;
