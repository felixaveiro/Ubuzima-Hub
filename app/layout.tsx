import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "VitaScope Rwanda - AI-Powered Nutrition Intelligence",
  description: "Combat hidden hunger and malnutrition in Rwanda using AI-driven insights from comprehensive health and nutrition datasets",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
          <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">VitaScope Rwanda</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered nutrition intelligence for combating hidden hunger and improving food security in Rwanda.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Nutrition Dashboard</li>
                    <li>AI Insights</li>
                    <li>Data Explorer</li>
                    <li>Risk Assessment</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Data Sources</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>NISR Health Surveys</li>
                    <li>DHS Rwanda 2020</li>
                    <li>Agricultural Statistics</li>
                    <li>Market Price Data</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Partners</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Ministry of Health</li>
                    <li>NISR</li>
                    <li>WFP Rwanda</li>
                    <li>UNICEF Rwanda</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                <p>&copy; 2025 VitaScope Rwanda. Empowering nutrition security through data intelligence.</p>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
