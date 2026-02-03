import type React from "react"
import "./globals.css"
import "@/styles/nord.css"
import "@/styles/design-tokens.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "3D Portal Portfolio",
  description: "Interactive 3D portal to showcase projects",
  generator: "v0.dev",
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
