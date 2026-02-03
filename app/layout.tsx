import type React from "react"
import "./globals.css"
import "@/styles/nord.css"
import "@/styles/design-tokens.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Kappy — Homelab, Automation & Real Estate",
  description:
    "Kappy (Forest Hills, Queens) — real estate operations, homelab/self-hosting, and business automation.",
  applicationName: "Kappy",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased selection:bg-nord-8/30 selection:text-nord-6">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
