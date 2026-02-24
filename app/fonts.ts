import localFont from "next/font/local"

export const nord = localFont({
  variable: "--font-nord",
  display: "swap",
  src: [
    {
      path: "../public/fonts/nord/Nord-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/nord/Nord-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/nord/Nord-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/nord/Nord-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/nord/Nord-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nord/Nord-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/nord/Nord-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/nord/Nord-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/nord/Nord-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/nord/Nord-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/nord/Nord-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/nord/Nord-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "Noto Sans",
    "sans-serif",
  ],
})
