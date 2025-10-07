"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, BarChart3, Database, Brain, Home, Menu, TrendingUp } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home, description: "Homepage" },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, description: "Nutrition Overview" },
  { name: "Data Explorer", href: "/data", icon: Database, description: "Dataset Analysis" },
  { name: "AI Insights", href: "/insights", icon: Brain, description: "Smart Analytics" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b">
            <Link href="/" className="flex items-center space-x-3 group" onClick={() => setOpen(false)}>
              <div className="relative">
                <Heart className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Ubuzima hub</span>
                <span className="text-xs text-muted-foreground leading-none">Nutrition Intelligence</span>
              </div>
            </Link>
          </div>

          <nav className="flex flex-col space-y-2 mt-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={cn(
                    "justify-start h-auto py-3 px-4 transition-all duration-300",
                    isActive 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "hover:bg-green-500 hover:text-white text-muted-foreground"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Link href={item.href} className="flex items-center space-x-3">
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "text-white" : "group-hover:text-white"
                    )} />
                    <div className="flex flex-col items-start">
                      <span className={cn(
                        "text-base font-medium",
                        isActive ? "text-white" : "group-hover:text-white"
                      )}>
                        {item.name}
                      </span>
                      <span className={cn(
                        "text-xs opacity-70",
                        isActive ? "text-white/80" : "text-muted-foreground group-hover:text-white/80"
                      )}>
                        {item.description}
                      </span>
                    </div>
                  </Link>
                </Button>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center">
              ubuzima hub • Ending Hidden Hunger • 2025 Hackathon
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
