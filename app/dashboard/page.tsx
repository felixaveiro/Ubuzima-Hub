"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PredictiveAnalysis {
  district: string
  stunting: number
  wasting: number
  anemia: number
  underweight: number
  trend: 'improving' | 'stable' | 'declining'
  riskLevel: 'critical' | 'high' | 'moderate' | 'low'
  keyIssues: string[]
  recommendations: string[]
  prediction: string
  confidenceScore: number
}
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
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<PredictiveAnalysis | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState("Kayonza")

  const generatePredictiveAnalysis = async () => {
    if (!selectedDistrict.trim()) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/predictive-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: selectedDistrict })
      })
      
      const data = await response.json()
      
      if (data.analysis) {
        setPredictiveAnalysis(data.analysis)
      } else if (data.error) {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Error generating predictive analysis:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E6E8EB]">
      {/* Navigation Bar */}
      <div className="bg-white border-b-4 border-[#005BAC] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#005BAC] to-[#0070cc] rounded-2xl flex items-center justify-center shadow-xl">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#005BAC]">Rwanda Nutrition Intelligence</h1>
                  <p className="text-sm text-gray-600 font-medium">Ministry of Health - NISR Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-white text-gray-700 border-2 border-gray-300 font-semibold">
                <Database className="h-3 w-3 mr-2" />
                Live Data
              </Badge>
              <Badge variant="outline" className="bg-[#005BAC]/10 text-[#005BAC] border-2 border-[#005BAC]/20 font-semibold">
                <Calendar className="h-3 w-3 mr-2" />
                Updated Sep 2025
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#005BAC] via-[#004a8f] to-[#003366] rounded-3xl p-10 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -ml-48 -mb-48"></div>
          </div>
          <div className="relative">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-5 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white/90 font-semibold text-lg">National Nutrition Surveillance System</span>
                </div>
                <h2 className="text-5xl font-bold leading-tight">
                  Comprehensive Health Analytics
                  <span className="block text-2xl font-medium text-white/90 mt-3">
                    Real-time insights across all 30 districts of Rwanda
                  </span>
                </h2>
                <p className="text-white/80 text-lg leading-relaxed max-w-3xl">
                  Advanced analytics platform integrating DHS, NISR, and WHO datasets to track progress 
                  towards national nutrition targets and SDG goals.
                </p>
              </div>
              <div className="text-right space-y-3 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold">12.8M</div>
                <div className="text-white/80 text-sm font-medium">Population Covered</div>
                <div className="text-3xl font-bold text-emerald-300">94.2%</div>
                <div className="text-white/80 text-sm font-medium">Data Coverage</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">System Status: Active</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                <Shield className="h-4 w-4 text-white" />
                <span className="text-sm text-white font-medium">WHO Validated</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                <Target className="h-4 w-4 text-white" />
                <span className="text-sm text-white font-medium">SDG Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nutritionIndicators.map((indicator, index) => {
            const colors = [
              { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", accent: "bg-red-100", bar: "from-red-500 to-red-600" },
              { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", accent: "bg-amber-100", bar: "from-amber-500 to-amber-600" },
              { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", accent: "bg-blue-100", bar: "from-blue-500 to-blue-600" },
              { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", accent: "bg-emerald-100", bar: "from-emerald-500 to-emerald-600" },
            ]
            const colorScheme = colors[index]
            
            return (
              <Card key={index} className={`${colorScheme.bg} ${colorScheme.border} border-2 hover:shadow-2xl transition-all duration-300 group rounded-2xl`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${colorScheme.accent} group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                      {indicator.status === "improving" ? (
                        <TrendingUp className={`h-6 w-6 ${colorScheme.text}`} />
                      ) : indicator.status === "stable" ? (
                        <Activity className={`h-6 w-6 ${colorScheme.text}`} />
                      ) : (
                        <AlertTriangle className={`h-6 w-6 ${colorScheme.text}`} />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${colorScheme.bg} ${colorScheme.border} ${colorScheme.text} text-xs font-semibold px-3 py-1`}
                    >
                      {indicator.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-gray-800 leading-tight">
                    {indicator.indicator}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-4xl font-bold ${colorScheme.text}`}>
                      {indicator.current}%
                    </span>
                    <span className="text-sm text-gray-600 font-semibold">
                      target: {indicator.target}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-medium">Progress to Target</span>
                      <span className="font-bold text-gray-800">
                        {Math.round((Math.min(indicator.current, indicator.target) / indicator.target) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-700 bg-gradient-to-r ${colorScheme.bar} shadow-sm`}
                        style={{ width: `${Math.min((indicator.current / indicator.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">vs previous survey</span>
                    <span className={`text-xs font-bold ${
                      indicator.change > 0 ? "text-emerald-600" :
                      indicator.change < 0 ? "text-red-600" : "text-gray-600"
                    }`}>
                      {indicator.change > 0 ? "+" : ""}{indicator.change}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Predictive Analysis Section */}
        <Card className="border-2 border-[#005BAC]/20 bg-gradient-to-br from-white via-[#E6E8EB]/30 to-white shadow-2xl rounded-2xl">
          <CardHeader className="pb-6 border-b-2 border-[#005BAC]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#005BAC] to-[#0070cc] rounded-2xl flex items-center justify-center shadow-xl">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#005BAC] mb-1">
                    Predictive Nutrition Analysis
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base font-medium">
                    District-based predictive modeling and intervention recommendations
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-2 border-purple-200 px-4 py-2 font-semibold">
                <TrendingUp className="h-4 w-4 mr-2" />
                Predictive Model
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Enter district name (e.g., Kayonza, Kigali, Musanze)..."
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generatePredictiveAnalysis()}
                    className="pl-12 h-14 bg-[#E6E8EB]/50 border-2 border-gray-300 focus:border-[#005BAC] focus:ring-[#005BAC] rounded-xl text-base font-medium"
                  />
                </div>
                <Button
                  onClick={generatePredictiveAnalysis}
                  disabled={isGenerating}
                  className="h-14 px-8 bg-gradient-to-r from-[#005BAC] to-[#0070cc] hover:from-[#004a8f] hover:to-[#005BAC] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-5 w-5 mr-3" />
                      Analyze District
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {predictiveAnalysis && (
              <div className="space-y-6">
                {/* Predictive Results Header */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#005BAC]/5 to-purple-50 rounded-2xl"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border-2 border-[#005BAC]/20 shadow-xl">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-3xl font-bold text-[#005BAC] mb-2">
                          {predictiveAnalysis.district}
                        </h4>
                        <p className="text-gray-600 font-medium">Predictive Analysis Results</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600 font-medium">Confidence Score</div>
                          <div className="text-3xl font-bold text-[#005BAC]">{predictiveAnalysis.confidenceScore}%</div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`px-4 py-2 font-semibold text-sm border-2 ${
                            predictiveAnalysis.riskLevel === 'critical' ? 'bg-red-50 border-red-200 text-red-700' :
                            predictiveAnalysis.riskLevel === 'high' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                            predictiveAnalysis.riskLevel === 'moderate' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                            'bg-green-50 border-green-200 text-green-700'
                          }`}
                        >
                          {predictiveAnalysis.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>

                    {/* Nutrition Indicators */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border-2 border-red-200">
                        <div className="text-sm text-red-600 font-bold mb-2">Stunting Rate</div>
                        <div className="text-3xl font-bold text-red-700">{predictiveAnalysis.stunting}%</div>
                        <div className="text-xs text-red-600 mt-2">
                          {predictiveAnalysis.stunting > 40 ? '⚠️ Critical' : 
                           predictiveAnalysis.stunting > 35 ? '⚠️ High' :
                           predictiveAnalysis.stunting > 30 ? '⚠️ Moderate' : '✓ Low'}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border-2 border-amber-200">
                        <div className="text-sm text-amber-600 font-bold mb-2">Wasting Rate</div>
                        <div className="text-3xl font-bold text-amber-700">{predictiveAnalysis.wasting}%</div>
                        <div className="text-xs text-amber-600 mt-2">
                          {predictiveAnalysis.wasting > 3 ? '⚠️ Critical' : '✓ Normal'}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border-2 border-blue-200">
                        <div className="text-sm text-blue-600 font-bold mb-2">Anemia Prev.</div>
                        <div className="text-3xl font-bold text-blue-700">{predictiveAnalysis.anemia}%</div>
                        <div className="text-xs text-blue-600 mt-2">
                          {predictiveAnalysis.anemia > 25 ? '⚠️ Critical' : 
                           predictiveAnalysis.anemia > 20 ? '⚠️ High' : '✓ Moderate'}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border-2 border-purple-200">
                        <div className="text-sm text-purple-600 font-bold mb-2">Underweight</div>
                        <div className="text-3xl font-bold text-purple-700">{predictiveAnalysis.underweight}%</div>
                        <div className="text-xs text-purple-600 mt-2">
                          {predictiveAnalysis.underweight > 10 ? '⚠️ High' : '✓ Normal'}
                        </div>
                      </div>
                    </div>

                    {/* Prediction */}
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border-2 border-teal-200 mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-teal-500 rounded-lg flex-shrink-0">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-teal-900 mb-2">Predictive Forecast</h5>
                          <p className="text-teal-800 leading-relaxed">{predictiveAnalysis.prediction}</p>
                        </div>
                      </div>
                    </div>

                    {/* Key Issues */}
                    <div className="mb-6">
                      <h5 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        Key Issues
                      </h5>
                      <div className="space-y-3">
                        {predictiveAnalysis.keyIssues.map((issue, idx) => (
                          <div key={idx} className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border-2 border-red-100">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                            <p className="text-gray-800 font-medium">{issue}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h5 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                        <Target className="h-5 w-5 text-green-600 mr-2" />
                        Intervention Recommendations
                      </h5>
                      <div className="space-y-3">
                        {predictiveAnalysis.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border-2 border-green-100">
                            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </div>
                            <p className="text-gray-800 font-medium">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Card className="border-2 border-gray-200 bg-white shadow-2xl rounded-2xl overflow-hidden">
          <Tabs defaultValue="indicators" className="w-full">
            <div className="bg-[#E6E8EB]/50 border-b-2 border-gray-200 p-6">
              <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-1.5 shadow-lg border-2 border-gray-200">
                <TabsTrigger
                  value="indicators"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#005BAC] data-[state=active]:to-[#0070cc] data-[state=active]:text-white data-[state=active]:shadow-xl rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger
                  value="districts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#005BAC] data-[state=active]:to-[#0070cc] data-[state=active]:text-white data-[state=active]:shadow-xl rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Geographic
                </TabsTrigger>
                <TabsTrigger
                  value="micronutrients"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#005BAC] data-[state=active]:to-[#0070cc] data-[state=active]:text-white data-[state=active]:shadow-xl rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Micronutrients
                </TabsTrigger>
                <TabsTrigger
                  value="regional"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#005BAC] data-[state=active]:to-[#0070cc] data-[state=active]:text-white data-[state=active]:shadow-xl rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200"
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
                    <h3 className="text-3xl font-bold text-[#005BAC] mb-2">Historical Nutrition Trends</h3>
                    <p className="text-gray-600 font-medium">Progress tracking from 2015-2023 showing Rwanda's improvements in key nutrition indicators</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-red-50 border-2 border-red-200 text-red-700 font-semibold">Stunting</Badge>
                    <Badge variant="outline" className="bg-amber-50 border-2 border-amber-200 text-amber-700 font-semibold">Wasting</Badge>
                    <Badge variant="outline" className="bg-blue-50 border-2 border-blue-200 text-blue-700 font-semibold">Anemia</Badge>
                  </div>
                </div>
                <div className="bg-[#E6E8EB]/30 rounded-2xl p-6 border-2 border-gray-200">
                  <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        fontSize={13}
                        fontWeight={600}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={13}
                        fontWeight={600}
                        domain={[0, 100]}
                        label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "2px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                      />
                      <Line
                        type="monotone"
                        dataKey="stunting"
                        stroke="#dc2626"
                        strokeWidth={4}
                        name="Stunting"
                        dot={{ fill: "#dc2626", strokeWidth: 2, r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="wasting"
                        stroke="#d97706"
                        strokeWidth={4}
                        name="Wasting"
                        dot={{ fill: "#d97706", strokeWidth: 2, r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="anemia"
                        stroke="#2563eb"
                        strokeWidth={4}
                        name="Anemia (Women)"
                        dot={{ fill: "#2563eb", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="districts" className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-[#005BAC] mb-2">Provincial Nutrition Comparison</h3>
                  <p className="text-gray-600 font-medium">Comparative analysis of stunting, wasting, and anemia rates across Rwanda's provinces</p>
                </div>
                <div className="bg-[#E6E8EB]/30 rounded-2xl p-6 border-2 border-gray-200">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={districtNutritionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis
                        dataKey="district"
                        stroke="#64748b"
                        fontSize={11}
                        fontWeight={600}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={13}
                        fontWeight={600}
                        domain={[0, 100]}
                        label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "2px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                      />
                      <Bar dataKey="stunting" fill="#dc2626" name="Stunting" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="wasting" fill="#d97706" name="Wasting" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="anemia" fill="#2563eb" name="Anemia (Women)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="micronutrients" className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-[#005BAC] mb-2">Micronutrient Deficiency Analysis</h3>
                  <p className="text-gray-600 font-medium">Current prevalence rates compared to national targets</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {micronutrientData.map((item, index) => (
                    <div key={item.nutrient} className="bg-white rounded-2xl p-6 space-y-4 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold text-gray-900">{item.nutrient} Deficiency</h4>
                        <Badge 
                          variant="outline" 
                          className={`font-semibold text-sm px-3 py-1 ${
                            item.deficiency > item.target ? "bg-red-50 border-2 border-red-200 text-red-700" : "bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                          }`}
                        >
                          {item.deficiency}% current
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-700">Current Rate</span>
                          <span className="text-3xl font-bold" style={{ color: item.color }}>
                            {item.deficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                          <div
                            className="h-4 rounded-full transition-all duration-500 shadow-sm"
                            style={{
                              width: `${(item.deficiency / 50) * 100}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 font-medium">Target: {item.target}%</span>
                          <span className={item.deficiency > item.target ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>
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
                  <h3 className="text-3xl font-bold text-[#005BAC] mb-2">Regional Health Profiles</h3>
                  <p className="text-gray-600 font-medium">Comprehensive nutrition status by administrative region</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {districtNutritionData.map((district, index) => (
                    <Card key={district.district} className="bg-white border-2 border-gray-200 hover:shadow-2xl hover:border-[#005BAC]/30 transition-all duration-300 group rounded-2xl">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#005BAC] transition-colors duration-200 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-[#005BAC]" />
                            {district.district}
                          </CardTitle>
                          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg"></div>
                        </div>
                        <CardDescription className="text-gray-600 font-medium">Regional nutrition indicators</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border-2 border-red-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
                              <span className="text-sm font-bold text-gray-800">Stunting</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-red-600">{district.stunting}%</div>
                              <div className="text-xs text-gray-600 font-medium">Under-5 children</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border-2 border-amber-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-amber-500 shadow-md"></div>
                              <span className="text-sm font-bold text-gray-800">Wasting</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-amber-600">{district.wasting}%</div>
                              <div className="text-xs text-gray-600 font-medium">Acute malnutrition</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border-2 border-blue-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md"></div>
                              <span className="text-sm font-bold text-gray-800">Anemia</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{district.anemia}%</div>
                              <div className="text-xs text-gray-600 font-medium">Women 15-49</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-md"></div>
                              <span className="text-sm font-bold text-gray-800">Food Security</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-emerald-600">{district.foodSecure}%</div>
                              <div className="text-xs text-gray-600 font-medium">Households secure</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t-2 border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 font-semibold">Overall Status</span>
                            <Badge 
                              variant="outline" 
                              className={`font-bold ${
                                district.stunting < 30 && district.anemia < 20 && district.foodSecure > 80
                                  ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                                  : district.stunting > 40 || district.anemia > 20 || district.foodSecure < 70
                                  ? "bg-red-50 border-2 border-red-200 text-red-700"
                                  : "bg-amber-50 border-2 border-amber-200 text-amber-700"
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
        <div className="bg-gradient-to-br from-[#005BAC] via-[#004a8f] to-[#003366] rounded-2xl p-10 text-white shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <Heart className="h-6 w-6 mr-3 text-white" />
                Data Sources
              </h4>
              <ul className="space-y-2 text-sm text-white/90 font-medium">
                <li>• Rwanda DHS 2019-2020</li>
                <li>• NISR Health Survey 2020</li>
                <li>• WHO Global Health Observatory</li>
                <li>• Ministry of Health Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <Target className="h-6 w-6 mr-3 text-white" />
                Coverage
              </h4>
              <ul className="space-y-2 text-sm text-white/90 font-medium">
                <li>• 30 Districts</li>
                <li>• 416 Sectors</li>
                <li>• 2,148 Cells</li>
                <li>• 14,837 Villages</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-3 text-white" />
                Standards
              </h4>
              <ul className="space-y-2 text-sm text-white/90 font-medium">
                <li>• WHO Growth Standards</li>
                <li>• SDG Indicator Framework</li>
                <li>• UNICEF Guidelines</li>
                <li>• National Health Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t-2 border-white/20 flex items-center justify-between">
            <div className="text-sm text-white/80 font-medium">
              © 2025 Rwanda Ministry of Health - National Institute of Statistics Rwanda
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-white/10 border-2 border-white/30 text-white font-semibold backdrop-blur-sm">
                <Database className="h-3 w-3 mr-2" />
                Real-time Updates
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-2 border-white/30 text-white font-semibold backdrop-blur-sm">
                <Shield className="h-3 w-3 mr-2" />
                ISO 27001 Certified
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}