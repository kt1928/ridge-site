import type React from "react"
import "./globals.css"
import "@/styles/nord.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "3D Portal Portfolio",
  description: "Interactive 3D portal to showcase projects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
