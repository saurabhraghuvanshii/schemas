"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

// Custom Layer5-inspired theme instead of SistentThemeProvider,
// which has an internal bug using kebab-case CSS properties
// (ms-overflow-style) that Emotion rejects.
const layer5Theme = createTheme({
  palette: {
    primary: {
      main: "#00B39F",
      light: "#00D3A9",
      dark: "#007B6E",
      contrastText: "#fff",
    },
    secondary: {
      main: "#00D3A9",
      light: "#33DBBA",
      dark: "#009376",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f7f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#3c494f",
      secondary: "#647881",
    },
    success: {
      main: "#00B39F",
    },
    error: {
      main: "#F91313",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default function ThemeProvider_({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={layer5Theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
