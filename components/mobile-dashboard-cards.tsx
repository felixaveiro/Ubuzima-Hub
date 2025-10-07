
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Leaf, AlertTriangle, ChevronRight } from "lucide-react"

interface MobileDashboardCardsProps {
  onCardClick?: (cardType: string) => void
}

export function MobileDashboardCards({ onCardClick }: MobileDashboardCardsProps) {
  const metrics = [
    {
      id: "farmers",
      title: "Total Farmers",
      value: "2.1M",
      change: "+5.2%",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "bg-gradient-to-br from-blue-100/50 via-blue-50/50 to-transparent dark:from-blue-900/50 dark:via-blue-800/50 dark:to-transparent",
      borderColor: "border-blue-200/50 dark:border-blue-700/50",
      badgeBg: "bg-blue-100/50 dark:bg-blue-900/50",
      badgeBorder: "border-blue-200/50 dark:border-blue-700/50",
      badgeText: "text-blue-600 dark:text-blue-400",
      description: "Registered farmers",
    },
    {
      id: "yield",
      title: "Avg Yield",
      value: "6.4 T/Ha",
      change: "+12.3%",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgGradient: "bg-gradient-to-br from-green-100/50 via-green-50/50 to-transparent dark:from-green-900/50 dark:via-green-800/50 dark:to-transparent",
      borderColor: "border-green-200/50 dark:border-green-700/50",
      badgeBg: "bg-green-100/50 dark:bg-green-900/50",
      badgeBorder: "border-green-200/50 dark:border-green-700/50",
      badgeText: "text-green-600 dark:text-green-400",
      description: "Crop productivity",
    },
    {
      id: "security",
      title: "Food Security",
      value: "76%",
      change: "Stable",
      icon: Leaf,
      color: "text-teal-600 dark:text-teal-400",
      bgGradient: "bg-gradient-to-br from-teal-100/50 via-teal-50/50 to-transparent dark:from-teal-900/50 dark:via-teal-800/50 dark:to-transparent",
      borderColor: "border-teal-200/50 dark:border-teal-700/50",
      badgeBg: "bg-teal-100/50 dark:bg-teal-900/50",
      badgeBorder: "border-teal-200/50 dark:border-teal-700/50",
      badgeText: "text-teal-600 dark:text-teal-400",
      description: "Secure households",
    },
    {
      id: "risk",
      title: "Risk Areas",
      value: "12",
      change: "-2 districts",
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgGradient: "bg-gradient-to-br from-red-100/50 via-red-50/50 to-transparent dark:from-red-900/50 dark:via-red-800/50 dark:to-transparent",
      borderColor: "border-red-200/50 dark:border-red-700/50",
      badgeBg: "bg-red-100/50 dark:bg-red-900/50",
      badgeBorder: "border-red-200/50 dark:border-red-700/50",
      badgeText: "text-red-600 dark:text-red-400",
      description: "Need attention",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card
            key={metric.id}
            className={`border-2 ${metric.borderColor} cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg animate-fadeIn ${metric.bgGradient}`}
            onClick={() => onCardClick?.(metric.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.badgeBg}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{metric.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={metric.id === "risk" ? "destructive" : "secondary"} 
                    className={`mb-2 rounded-full font-medium ${metric.badgeBg} ${metric.badgeBorder} ${metric.badgeText}`}
                  >
                    {metric.change}
                  </Badge>
                  <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
