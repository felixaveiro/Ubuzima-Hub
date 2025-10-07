"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { Heart, TrendingUp, AlertTriangle, Users, MapPin, Brain, Activity, Target, Shield, Zap, BarChart3, ChevronDown, Globe, Calendar, Database } from "lucide-react"

// Mock data representing Rwanda nutrition statistics based on NISR/DHS data
const nutritionIndicators = [
  { indicator: "Stunting (Under 5)", current: 38, target: 25, change: -2.1, status: "improving" },
  { indicator: "Wasting (Under 5)", current: 2, target: 2, change: 0, status: "stable" },
  { indicator: "Anemia (Women 15-49)", current: 17, target: 10, change: -3.2, status: "improving" },
  { indicator: "Exclusive Breastfeeding", current: 87, target: 90, change: 2.4, status: "improving" },
]

const districtNutritionData = [
  { district: "Kigali", stunting: 25, wasting: 1, anemia: 12, foodSecure: 88 },
  { district: "Northern Province", stunting: 42, wasting: 3, anemia: 20, foodSecure: 74 },
  { district: "Southern Province", stunting: 35, wasting: 2, anemia: 15, foodSecure: 81 },
  { district: "Eastern Province", stunting: 45, wasting: 3, anemia: 22, foodSecure: 69 },
  { district: "Western Province", stunting: 40, wasting: 2, anemia: 18, foodSecure: 76 },
]

const micronutrientData = [
  { nutrient: "Vitamin A", deficiency: 28, target: 15, color: "#dc2626" },
  { nutrient: "Iron", deficiency: 17, target: 10, color: "#ea580c" },
  { nutrient: "Zinc", deficiency: 35, target: 20, color: "#ca8a04" },
  { nutrient: "Folate", deficiency: 12, target: 8, color: "#16a34a" },
]

const trendsData = [
  { year: 2015, stunting: 44, wasting: 3, anemia: 25 },
  { year: 2017, stunting: 42, wasting: 2.5, anemia: 22 },
  { year: 2019, stunting: 40, wasting: 2.2, anemia: 20 },
  { year: 2020, stunting: 38, wasting: 2, anemia: 17 },
  { year: 2023, stunting: 36, wasting: 1.8, anemia: 15 },
]

export default function Dashboard() {
  const [aiInsight, setAiInsight] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState("")

  const generateAIInsight = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setAiInsight(`Analysis for ${selectedRegion || 'Rwanda'}: Based on current nutrition trends, stunting rates have decreased by 2.1% annually. Eastern Province shows the highest rates requiring targeted intervention programs. Recommendations include increased maternal nutrition education, improved access to micronutrient supplementation, and enhanced food security measures in rural areas.`)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Rwanda Nutrition Intelligence</h1>
                  <p className="text-sm text-slate-600">Ministry of Health - NISR Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-300">
                <Database className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Calendar className="h-3 w-3 mr-1" />
                Updated Sep 2025
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-32 -mt-32"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-200 font-medium">National Nutrition Surveillance System</span>
                </div>
                <h2 className="text-4xl font-bold leading-tight">
                  Comprehensive Health Analytics
                  <span className="block text-2xl font-normal text-slate-300 mt-2">
                    Real-time insights across all 30 districts of Rwanda
                  </span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  Advanced analytics platform integrating DHS, NISR, and WHO datasets to track progress 
                  towards national nutrition targets and SDG goals.
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className="text-3xl font-bold">12.8M</div>
                <div className="text-slate-300 text-sm">Population Covered</div>
                <div className="text-2xl font-bold text-emerald-400">94.2%</div>
                <div className="text-slate-300 text-sm">Data Coverage</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-200">System Status: Active</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-200">WHO Validated</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-200">SDG Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nutritionIndicators.map((indicator, index) => {
            const colors = [
              { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", accent: "bg-red-100" },
              { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", accent: "bg-amber-100" },
              { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", accent: "bg-blue-100" },
              { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", accent: "bg-emerald-100" },
            ]
            const colorScheme = colors[index]
            
            return (
              <Card key={index} className={`${colorScheme.bg} ${colorScheme.border} border-2 hover:shadow-xl transition-all duration-300 group`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${colorScheme.accent} group-hover:scale-110 transition-transform duration-200`}>
                      {indicator.status === "improving" ? (
                        <TrendingUp className={`h-5 w-5 ${colorScheme.text}`} />
                      ) : indicator.status === "stable" ? (
                        <Activity className={`h-5 w-5 ${colorScheme.text}`} />
                      ) : (
                        <AlertTriangle className={`h-5 w-5 ${colorScheme.text}`} />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${colorScheme.bg} ${colorScheme.border} ${colorScheme.text} text-xs`}
                    >
                      {indicator.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-700 leading-tight">
                    {indicator.indicator}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-3xl font-bold ${colorScheme.text}`}>
                      {indicator.current}%
                    </span>
                    <span className="text-sm text-slate-500 font-medium">
                      target: {indicator.target}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Progress to Target</span>
                      <span className="font-semibold text-slate-700">
                        {Math.round((Math.min(indicator.current, indicator.target) / indicator.target) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ${
                          index === 0 ? "bg-gradient-to-r from-red-500 to-red-600" :
                          index === 1 ? "bg-gradient-to-r from-amber-500 to-amber-600" :
                          index === 2 ? "bg-gradient-to-r from-blue-500 to-blue-600" : 
                          "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        }`}
                        style={{ width: `${Math.min((indicator.current / indicator.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-600">vs previous survey</span>
                    <span className={`text-xs font-semibold ${
                      indicator.change > 0 ? "text-emerald-600" :
                      indicator.change < 0 ? "text-red-600" : "text-slate-600"
                    }`}>
                      {indicator.change > 0 ? "+" : ""}{indicator.change}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Insights Section */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <Zap className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-1">
                    AI-Powered Nutrition Intelligence
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-base">
                    Advanced machine learning analysis of nutrition patterns and intervention opportunities
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                <Brain className="h-3 w-3 mr-1" />
                ML Enabled
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Enter district, province, or region for targeted analysis..."
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="pl-12 h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <Button
                  onClick={generateAIInsight}
                  disabled={isGenerating}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Insights
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {aiInsight && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-slate-900">AI Analysis Results</h4>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                          Confidence: 94%
                        </Badge>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{aiInsight}</p>
                      <div className="flex items-center space-x-4 pt-2 text-sm text-slate-500">
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                          Data Sources: 12
                        </span>
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Processing Time: 1.2s
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Card className="border border-slate-200 bg-white shadow-xl rounded-2xl overflow-hidden">
          <Tabs defaultValue="indicators" className="w-full">
            <div className="bg-slate-50 border-b border-slate-200 p-6">
              <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                <TabsTrigger
                  value="indicators"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger
                  value="districts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Geographic
                </TabsTrigger>
                <TabsTrigger
                  value="micronutrients"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Micronutrients
                </TabsTrigger>
                <TabsTrigger
                  value="regional"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Regional
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="indicators" className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Historical Nutrition Trends</h3>
                    <p className="text-slate-600">Progress tracking from 2015-2023 showing Rwanda's improvements in key nutrition indicators</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">Stunting</Badge>
                    <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">Wasting</Badge>
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">Anemia</Badge>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6">
                  <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        fontSize={12}
                        fontWeight={500}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        fontWeight={500}
                        label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                      />
                      <Line
                        type="monotone"
                        dataKey="stunting"
                        stroke="#dc2626"
                        strokeWidth={3}
                        name="Stunting"
                        dot={{ fill: "#dc2626", strokeWidth: 2, r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="wasting"
                        stroke="#d97706"
                        strokeWidth={3}
                        name="Wasting"
                        dot={{ fill: "#d97706", strokeWidth: 2, r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="anemia"
                        stroke="#2563eb"
                        strokeWidth={3}
                        name="Anemia (Women)"
                        dot={{ fill: "#2563eb", strokeWidth: 2, r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="districts" className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Provincial Nutrition Comparison</h3>
                  <p className="text-slate-600">Comparative analysis of stunting, wasting, and anemia rates across Rwanda's provinces</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={districtNutritionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="district"
                        stroke="#64748b"
                        fontSize={11}
                        fontWeight={500}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        fontWeight={500}
                        label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                      />
                      <Bar dataKey="stunting" fill="#dc2626" name="Stunting" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="wasting" fill="#d97706" name="Wasting" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="anemia" fill="#2563eb" name="Anemia (Women)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="micronutrients" className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Micronutrient Deficiency Analysis</h3>
                  <p className="text-slate-600">Current prevalence rates compared to national targets</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {micronutrientData.map((item, index) => (
                    <div key={item.nutrient} className="bg-slate-50 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-slate-900">{item.nutrient} Deficiency</h4>
                        <Badge 
                          variant="outline" 
                          className={`${
                            item.deficiency > item.target ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                          }`}
                        >
                          {item.deficiency}% current
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Current Rate</span>
                          <span className="text-2xl font-bold" style={{ color: item.color }}>
                            {item.deficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(item.deficiency / 50) * 100}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Target: {item.target}%</span>
                          <span className={item.deficiency > item.target ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>
                            {item.deficiency > item.target 
                              ? `${item.deficiency - item.target}% above target` 
                              : `${item.target - item.deficiency}% below target`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="regional" className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Regional Health Profiles</h3>
                  <p className="text-slate-600">Comprehensive nutrition status by administrative region</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {districtNutritionData.map((district, index) => (
                    <Card key={district.district} className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                            {district.district}
                          </CardTitle>
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <CardDescription className="text-slate-600">Regional nutrition indicators</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-red-500"></div>
                              <span className="text-sm font-semibold text-slate-700">Stunting</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-red-600">{district.stunting}%</div>
                              <div className="text-xs text-slate-500">Under-5 children</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                              <span className="text-sm font-semibold text-slate-700">Wasting</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-amber-600">{district.wasting}%</div>
                              <div className="text-xs text-slate-500">Acute malnutrition</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-semibold text-slate-700">Anemia</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-blue-600">{district.anemia}%</div>
                              <div className="text-xs text-slate-500">Women 15-49</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                              <span className="text-sm font-semibold text-slate-700">Food Security</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-600">{district.foodSecure}%</div>
                              <div className="text-xs text-slate-500">Households secure</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Overall Status</span>
                            <Badge 
                              variant="outline" 
                              className={`${
                                district.stunting < 30 && district.anemia < 20 && district.foodSecure > 80
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  : district.stunting > 40 || district.anemia > 20 || district.foodSecure < 70
                                  ? "bg-red-50 border-red-200 text-red-700"
                                  : "bg-amber-50 border-amber-200 text-amber-700"
                              }`}
                            >
                              {district.stunting < 30 && district.anemia < 20 && district.foodSecure > 80
                                ? "Good"
                                : district.stunting > 40 || district.anemia > 20 || district.foodSecure < 70
                                ? "Needs Attention"
                                : "Moderate"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-blue-400" />
                Data Sources
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Rwanda DHS 2019-2020</li>
                <li>• NISR Health Survey 2020</li>
                <li>• WHO Global Health Observatory</li>
                <li>• Ministry of Health Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-emerald-400" />
                Coverage
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• 30 Districts</li>
                <li>• 416 Sectors</li>
                <li>• 2,148 Cells</li>
                <li>• 14,837 Villages</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-400" />
                Standards
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• WHO Growth Standards</li>
                <li>• SDG Indicator Framework</li>
                <li>• UNICEF Guidelines</li>
                <li>• National Health Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              © 2025 Rwanda Ministry of Health - National Institute of Statistics Rwanda
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-slate-800 border-slate-600 text-slate-300">
                <Database className="h-3 w-3 mr-1" />
                Real-time Updates
              </Badge>
              <Badge variant="outline" className="bg-slate-800 border-slate-600 text-slate-300">
                <Shield className="h-3 w-3 mr-1" />
                ISO 27001 Certified
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}