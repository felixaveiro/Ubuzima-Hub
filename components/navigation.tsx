"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Heart, BarChart3, Database, Brain, Home, TrendingUp } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home, description: "Homepage" },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, description: "Nutrition Overview" },
  { name: "Data Explorer", href: "/data", icon: Database, description: "Dataset Analysis" },
  { name: "AI Insights", href: "/insights", icon: Brain, description: "Smart Analytics" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
            <div className="relative p-2 rounded-lg transition-all duration-300 group-hover:bg-green-100 group-hover:shadow-md">
              <Heart className="h-7 w-7 text-primary transition-all duration-300 group-hover:text-green-600 group-hover:scale-110" />
              <TrendingUp className="absolute -top-1 -right-1 h-4 w-4 text-accent transition-all duration-300 group-hover:text-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none transition-colors duration-300 group-hover:text-green-600">
                ubuzima hub
              </span>
              <span className="text-xs text-muted-foreground leading-none transition-colors duration-300 group-hover:text-green-500">
                Nutrition Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 h-auto transition-all duration-300 relative overflow-hidden",
                    isActive 
                      ? "bg-blue-500 text-white shadow-lg hover:bg-blue-600" 
                      : "hover:bg-green-500 hover:text-white hover:shadow-md text-muted-foreground"
                  )}
                >
                  <Link href={item.href} className="group">
                    <Icon className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isActive 
                        ? "text-white scale-110" 
                        : "text-muted-foreground group-hover:text-white group-hover:scale-110"
                    )} />
                    <div className="flex flex-col items-start">
                      <span className={cn(
                        "text-sm font-medium transition-all duration-300",
                        isActive 
                          ? "text-white" 
                          : "group-hover:text-white"
                      )}>
                        {item.name}
                      </span>
                      {!isActive && (
                        <span className={cn(
                          "text-xs opacity-0 group-hover:opacity-100 transition-all duration-300",
                          "text-muted-foreground group-hover:text-white/90"
                        )}>
                          {item.description}
                        </span>
                      )}
                    </div>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-200"></div>
                    )}
                    {/* Hover effect overlay */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 transition-opacity duration-300",
                      !isActive && "group-hover:opacity-100"
                    )}></div>
                  </Link>
                </Button>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </nav>
  )
}
