"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, BarChart3, Database, Brain, Home, Menu, TrendingUp, X } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Data Explorer", href: "/data", icon: Database },
  { name: "AI Insights", href: "/insights", icon: Brain },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-slate-100"
        >
          <Menu className="h-5 w-5 text-slate-600" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-white p-0 flex flex-col">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Link 
            href="/" 
            className="flex items-center space-x-3 group" 
            onClick={() => setOpen(false)}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <TrendingUp className="h-2 w-2 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-slate-900">
                Ubuzima Hub
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                Nutrition Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-slate-100 group-hover:bg-blue-100"
                )}>
                  <Icon className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    isActive ? "text-white" : "text-slate-600 group-hover:text-blue-600"
                  )} />
                </div>
                <span className="text-sm font-medium">
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Call to Action */}
        <div className="px-3 pb-3 border-t border-slate-200 pt-3">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md h-9 text-sm"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Button>
        </div>

        {/* Footer */}
        <div className="px-3 py-3 bg-slate-50 border-t border-slate-200 mb-4">
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            Ubuzima Hub<br />
            <span className="text-slate-400">Ending Hidden Hunger • 2025</span>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}