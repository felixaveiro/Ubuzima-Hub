"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Share } from "lucide-react"

// Mock data for mobile charts
const cropYieldData = [
  { crop: "Maize", yield: 2.7 },
  { crop: "Rice", yield: 3.8 },
  { crop: "Beans", yield: 2.1 },
  { crop: "Cassava", yield: 15.0 },
  { crop: "Potato", yield: 9.5 },
]

const monthlyTrends = [
  { month: "Jan", value: 420 },
  { month: "Feb", value: 435 },
  { month: "Mar", value: 450 },
  { month: "Apr", value: 465 },
  { month: "May", value: 480 },
  { month: "Jun", value: 470 },
]

const regionData = [
  { name: "Eastern", value: 35, color: "hsl(var(--primary))" },
  { name: "Southern", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Western", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Northern", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Kigali", value: 5, color: "hsl(var(--chart-5))" },
]

export function MobileChartViewer() {
  const [activeChart, setActiveChart] = useState("yields")

  const shareChart = () => {
    if (navigator.share) {
      navigator.share({
        title: "AgriSight Rwanda - Agricultural Data",
        text: "Check out these agricultural insights from Rwanda",
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="yields" className="text-xs">
            Yields
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">
            Trends
          </TabsTrigger>
          <TabsTrigger value="regions" className="text-xs">
            Regions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="yields">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Crop Yields</CardTitle>
                  <CardDescription className="text-sm">Tons per hectare</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={shareChart}>
                    <Share className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cropYieldData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="yield" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Price Trends</CardTitle>
                  <CardDescription className="text-sm">Monthly averages (RWF)</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={shareChart}>
                    <Share className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrends} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Regional Distribution</CardTitle>
                  <CardDescription className="text-sm">Agricultural activity by province</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={shareChart}>
                    <Share className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {regionData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
