"use client";
import type { ReactNode } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1e3a8a" },
    secondary: { main: "#0f766e" },
    warning: { main: "#f59e0b" },
  },
  shape: { borderRadius: 12 },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}