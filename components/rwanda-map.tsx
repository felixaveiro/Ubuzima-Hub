"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"

interface District {
  name: string
  province: string
  stunting: number
  wasting: number
  anemia: number
  color: string
}

const rwandaDistricts: District[] = [
  // Northern Province
  { name: "Musanze", province: "North", stunting: 31, wasting: 8, anemia: 15, color: "#fb923c" },
  { name: "Burera", province: "North", stunting: 30, wasting: 8, anemia: 14, color: "#fb923c" },
  { name: "Gicumbi", province: "North", stunting: 28, wasting: 7, anemia: 13, color: "#fbbf24" },
  { name: "Gakenke", province: "North", stunting: 34, wasting: 9, anemia: 16, color: "#ef4444" },
  // Eastern Province
  { name: "Kayonza", province: "East", stunting: 39, wasting: 12, anemia: 18, color: "#ef4444" },
  { name: "Kirehe", province: "East", stunting: 36, wasting: 10, anemia: 17, color: "#ef4444" },
  { name: "Ngoma", province: "East", stunting: 25, wasting: 6, anemia: 12, color: "#22c55e" },
  { name: "Nyagatare", province: "East", stunting: 38, wasting: 11, anemia: 19, color: "#ef4444" },
  { name: "Gatsibo", province: "East", stunting: 37, wasting: 10, anemia: 18, color: "#ef4444" },
  { name: "Rwamagana", province: "East", stunting: 42, wasting: 13, anemia: 20, color: "#dc2626" },
  // Southern Province
  { name: "Huye", province: "South", stunting: 28, wasting: 7, anemia: 13, color: "#fbbf24" },
  { name: "Gisagara", province: "South", stunting: 33, wasting: 9, anemia: 15, color: "#fb923c" },
  { name: "Nyaruguru", province: "South", stunting: 32, wasting: 8, anemia: 15, color: "#fb923c" },
  { name: "Nyanza", province: "South", stunting: 26, wasting: 6, anemia: 12, color: "#22c55e" },
  // Western Province
  { name: "Karongi", province: "West", stunting: 35, wasting: 9, anemia: 16, color: "#ef4444" },
  { name: "Nyamasheke", province: "West", stunting: 33, wasting: 8, anemia: 15, color: "#fb923c" },
  { name: "Rusizi", province: "West", stunting: 34, wasting: 9, anemia: 16, color: "#fb923c" },
  { name: "Rutsiro", province: "West", stunting: 31, wasting: 8, anemia: 14, color: "#fb923c" },
  { name: "Rubavu", province: "West", stunting: 29, wasting: 7, anemia: 13, color: "#fbbf24" },
  // Kigali City
  { name: "Kigali", province: "Central", stunting: 18, wasting: 4, anemia: 9, color: "#22c55e" },
  { name: "Gasabo", province: "Central", stunting: 20, wasting: 5, anemia: 10, color: "#22c55e" },
  { name: "Kicukiro", province: "Central", stunting: 19, wasting: 4, anemia: 9, color: "#22c55e" },
]

export function RwandaMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Rwamagana")

  const selectedDistrictData = rwandaDistricts.find(d => d.name === selectedDistrict)

  const topDistricts = [...rwandaDistricts]
    .sort((a, b) => b.stunting - a.stunting)
    .slice(0, 5)

  const trends = [
    { year: "DHS 2015", value: 38 },
    { year: "DHS 2017", value: 35 },
    { year: "DHS 2020", value: 32 },
    { year: "DHS 2023", value: 29 },
  ]

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-4 pb-3">
            <div className="text-xs text-orange-700 font-medium mb-1">Stunting (%)</div>
            <div className="text-3xl font-bold text-orange-600 mb-0.5">32%</div>
            <div className="text-[10px] text-orange-600">DHS 2020</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4 pb-3">
            <div className="text-xs text-green-700 font-medium mb-1">Wasting (%)</div>
            <div className="text-3xl font-bold text-green-600 mb-0.5">9%</div>
            <div className="text-[10px] text-green-600">DHS 2020</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
          <CardContent className="pt-4 pb-3">
            <div className="text-xs text-orange-700 font-medium mb-1">Anemia in women (%)</div>
            <div className="text-3xl font-bold text-orange-600 mb-0.5">16%</div>
            <div className="text-[10px] text-orange-600">DHS 2020</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Map and Legend */}
        <div className="space-y-4">
          {/* Interactive SVG Map Placeholder */}
          <Card>
            <CardContent className="p-4">
              <div className="relative bg-slate-100 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                {/* Simplified Rwanda Shape */}
                <svg viewBox="0 0 400 500" className="w-full h-full max-w-xs">
                  {/* Northern Province */}
                  <path d="M150,50 L250,50 L280,100 L250,150 L150,150 L120,100 Z" fill="#22c55e" stroke="#fff" strokeWidth="2" className="hover:opacity-80 cursor-pointer transition-opacity" onClick={() => setSelectedDistrict("Musanze")} />
                  
                  {/* Eastern Province */}
                  <path d="M280,100 L350,150 L350,250 L300,280 L250,250 L250,150 Z" fill="#ef4444" stroke="#fff" strokeWidth="2" className="hover:opacity-80 cursor-pointer transition-opacity" onClick={() => setSelectedDistrict("Rwamagana")} />
                  
                  {/* Kigali (Central) */}
                  <ellipse cx="200" cy="200" rx="50" ry="50" fill="#22c55e" stroke="#fff" strokeWidth="2" className="hover:opacity-80 cursor-pointer transition-opacity" onClick={() => setSelectedDistrict("Kigali")} />
                  
                  {/* Southern Province */}
                  <path d="M150,250 L250,250 L280,350 L200,450 L120,350 Z" fill="#fb923c" stroke="#fff" strokeWidth="2" className="hover:opacity-80 cursor-pointer transition-opacity" onClick={() => setSelectedDistrict("Huye")} />
                  
                  {/* Western Province */}
                  <path d="M50,150 L120,100 L150,150 L150,250 L120,350 L50,300 Z" fill="#fb923c" stroke="#fff" strokeWidth="2" className="hover:opacity-80 cursor-pointer transition-opacity" onClick={() => setSelectedDistrict("Karongi")} />
                  
                  {/* Labels */}
                  <text x="200" y="100" textAnchor="middle" className="text-[10px] font-semibold fill-slate-700">North</text>
                  <text x="300" y="200" textAnchor="middle" className="text-[10px] font-semibold fill-white">East</text>
                  <text x="200" y="200" textAnchor="middle" className="text-[10px] font-bold fill-white">Kigali</text>
                  <text x="200" y="350" textAnchor="middle" className="text-[10px] font-semibold fill-slate-700">South</text>
                  <text x="85" y="225" textAnchor="middle" className="text-[10px] font-semibold fill-slate-700">West</text>
                </svg>
              </div>
              
              {/* Selected District Info */}
              {selectedDistrictData && (
                <div className="mt-4 p-3 bg-white rounded-lg border-2 border-blue-500">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: selectedDistrictData.color }}></div>
                    <span className="font-bold text-sm">{selectedDistrictData.name}</span>
                  </div>
                  <p className="text-xs text-slate-600">Stunting: {selectedDistrictData.stunting}% (DHS 2020)</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs font-medium">Stunting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span className="text-xs font-medium">Wasting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs font-medium">Anemia</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Charts */}
        <div className="space-y-4">
          {/* Top Districts Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Districts with highest stunting</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={topDistricts} layout="vertical" margin={{ left: 60, right: 10, top: 5, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 60]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="stunting" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trends Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Stunting in Rwanda</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={trends} margin={{ left: 5, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis domain={[20, 45]} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Districts List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">All Districts - Click to View Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
            {rwandaDistricts.map((district) => (
              <button
                key={district.name}
                onClick={() => setSelectedDistrict(district.name)}
                className={`px-2 py-1.5 rounded-lg font-medium text-xs text-white transition-all ${
                  selectedDistrict === district.name
                    ? "ring-2 ring-offset-2 ring-blue-500 scale-105"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: district.color }}
              >
                {district.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}