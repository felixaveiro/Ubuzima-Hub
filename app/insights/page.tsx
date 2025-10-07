"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Sparkles, MapPin, Users, Activity, ChevronRight, Zap } from "lucide-react"
import { LucideIcon } from "lucide-react"

// Define types for better TypeScript support
interface Insight {
  question: string
  answer: string
  category: string
  region: string
  timestamp: Date
}

interface Category {
  id: string
  name: string
  icon: LucideIcon
  description: string
  gradient: string
}

interface Region {
  name: string
  population: string
  stuntingRate: string
  keyIssues: string[]
  priority: string
  color: string
  emoji: string
}

// Predefined questions and categories
const predefinedQuestions = [
  "Which districts have the highest rates of child stunting and need immediate intervention?",
  "What are the root causes of micronutrient deficiencies in Northern Province?",
  "How can we predict malnutrition hotspots before they become critical?",
  "Which communities are most vulnerable to hidden hunger based on current data?",
  "What targeted interventions would be most effective for reducing stunting rates?",
  "How do agricultural patterns correlate with malnutrition in different regions?",
]

const insightCategories: Category[] = [
  { 
    id: "malnutrition-hotspots", 
    name: "Malnutrition Hotspots", 
    icon: Target, 
    description: "Identify high-risk areas",
    gradient: "from-red-500/10 to-orange-500/10"
  },
  { 
    id: "risk-assessment", 
    name: "Nutrition Risk Assessment", 
    icon: AlertTriangle, 
    description: "Analyze vulnerability patterns",
    gradient: "from-yellow-500/10 to-amber-500/10"
  },
  { 
    id: "intervention-analysis", 
    name: "Intervention Analysis", 
    icon: TrendingUp, 
    description: "Measure program effectiveness",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  { 
    id: "policy-recommendations", 
    name: "Policy Recommendations", 
    icon: Lightbulb, 
    description: "Strategic action plans",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
]

// Regional profiles
const regionalProfiles: Record<string, Region> = {
  all: {
    name: "National Overview",
    population: "13.2M",
    stuntingRate: "33%",
    keyIssues: ["Micronutrient deficiencies", "Rural-urban disparities", "Seasonal food insecurity"],
    priority: "Comprehensive national strategy",
    color: "from-purple-600/20 to-blue-600/20",
    emoji: "🇷🇼"
  },
  Northern: {
    name: "Northern Province",
    population: "2.1M",
    stuntingRate: "29%",
    keyIssues: ["Iron deficiency", "Limited crop diversity", "Mountain terrain challenges"],
    priority: "Agricultural diversification and iron supplementation",
    color: "from-blue-500/20 to-indigo-500/20",
    emoji: "🏔️"
  },
  Southern: {
    name: "Southern Province",
    population: "2.8M",
    stuntingRate: "38%",
    keyIssues: ["Highest stunting rates", "Vitamin A deficiency", "Food access barriers"],
    priority: "Immediate intervention for severe malnutrition hotspots",
    color: "from-red-500/20 to-pink-500/20",
    emoji: "🌾"
  },
  Eastern: {
    name: "Eastern Province",
    population: "2.6M",
    stuntingRate: "35%",
    keyIssues: ["Zinc deficiency", "Drought vulnerability", "Limited healthcare access"],
    priority: "Climate-resilient nutrition programs",
    color: "from-orange-500/20 to-yellow-500/20",
    emoji: "🌅"
  },
  Western: {
    name: "Western Province",
    population: "2.4M",
    stuntingRate: "31%",
    keyIssues: ["Protein deficiency", "Market access challenges", "Traditional feeding practices"],
    priority: "Nutrition education and market linkages",
    color: "from-green-500/20 to-teal-500/20",
    emoji: "🌲"
  },
  Kigali: {
    name: "Kigali City",
    population: "1.3M",
    stuntingRate: "25%",
    keyIssues: ["Urban malnutrition", "Processed food dependency", "Income inequality"],
    priority: "Urban nutrition programs and food quality",
    color: "from-indigo-500/20 to-purple-500/20",
    emoji: "🏙️"
  },
}

export default function InsightsPage() {
  const [question, setQuestion] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("malnutrition-hotspots")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [insight, setInsight] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [regionalContext, setRegionalContext] = useState("")
  const [typewriterText, setTypewriterText] = useState("")
  const [insightHistory, setInsightHistory] = useState<Insight[]>([])

  // Typewriter effect for insight display
  useEffect(() => {
    if (!insight || insight === typewriterText) return

    setTypewriterText("")
    let i = 0
    const timer = setInterval(() => {
      if (i < insight.length) {
        setTypewriterText(insight.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [insight])

  // Generate insight
  const generateInsight = useCallback(async () => {
    if (!question.trim()) return

    setIsGenerating(true)
    setInsight("")
    setTypewriterText("")
    
    try {
      const currentRegion = regionalProfiles[selectedRegion]
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          category: selectedCategory,
          region: selectedRegion,
          regionalProfile: currentRegion,
          context: "advanced_regional_analysis",
        }),
      })

      const data = await response.json()
      setInsight(data.insight)
      setInsightHistory((prev) => [
        {
          question,
          answer: data.insight,
          category: selectedCategory,
          region: selectedRegion,
          timestamp: new Date(),
        },
        ...prev.slice(0, 4),
      ])
    } catch (error) {
      console.error("Error generating insight:", error)
      setInsight("Unable to generate insights at this time. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }, [question, selectedCategory, selectedRegion])

  // Generate regional context
  const generateRegionalContext = useCallback(async () => {
    if (selectedRegion === "all") {
      setRegionalContext("")
      setInsight("")
      return
    }

    const currentRegion = regionalProfiles[selectedRegion]
    setRegionalContext(
      `Analyzing ${currentRegion.name} - Population: ${currentRegion.population}, Stunting Rate: ${currentRegion.stuntingRate}`
    )

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Provide a comprehensive nutrition analysis overview for ${currentRegion.name}`,
          category: "malnutrition-hotspots",
          region: selectedRegion,
          regionalProfile: currentRegion,
          context: "regional_overview",
        }),
      })

      const data = await response.json()
      setInsight(data.insight)
    } catch (error) {
      console.error("Error generating regional context:", error)
    }
  }, [selectedRegion])

  // Handle region change
  const handleRegionChange = useCallback((value: string) => {
    setSelectedRegion(value)
    if (value !== "all") {
      generateRegionalContext()
    } else {
      setRegionalContext("")
      setInsight("")
    }
  }, [generateRegionalContext])

  // Handle category selection
  const handleCategorySelect = useCallback((id: string) => {
    setSelectedCategory(id)
  }, [])

  const currentRegion = regionalProfiles[selectedRegion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-teal-900 dark:to-emerald-800 font-sans">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-r from-teal-300/10 to-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 shadow-xl">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              <span className="text-sm font-bold uppercase text-teal-700 dark:text-teal-300 tracking-wide">AI-Powered Insights</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-teal-800 to-emerald-600 dark:from-teal-300 dark:to-emerald-300 bg-clip-text text-transparent mb-4">
            Nutrition Intelligence Hub
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Unlock actionable insights to combat hidden hunger using Rwanda's comprehensive nutrition data ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Insight Generator */}
          <div className="lg:col-span-9 space-y-6">
            <Card className="border-none shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">AI Insight Generator</CardTitle>
                      <CardDescription className="text-base text-gray-500 dark:text-gray-400">
                        Ask about malnutrition, micronutrient deficiencies, or intervention strategies
                      </CardDescription>
                    </div>
                  </div>
                  {isGenerating && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-800/50">
                      <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"></div>
                      <span className="text-xs font-medium text-teal-600 dark:text-teal-300">Processing...</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 rounded-lg transition-all">
                      <SelectValue placeholder="Select insight category" />
                    </SelectTrigger>
                    <SelectContent>
                      {insightCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="py-3">
                          <div className="flex items-center gap-3">
                            <category.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            <div>
                              <div className="font-medium text-gray-800 dark:text-gray-200">{category.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{category.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedRegion} onValueChange={handleRegionChange}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 rounded-lg transition-all">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(regionalProfiles).map(([key, region]) => (
                        <SelectItem key={key} value={key} className="py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{region.emoji}</span>
                            <div>
                              <div className="font-medium text-gray-800 dark:text-gray-200">{region.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Population: {region.population}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="🤖 Ask about malnutrition hotspots, stunting rates, or intervention strategies..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[120px] border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 rounded-lg transition-all resize-none text-base text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder:text-gray-500"
                  aria-label="Enter your nutrition question"
                />

                <Button
                  onClick={generateInsight}
                  disabled={isGenerating || !question.trim()}
                  className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                      Analyzing Nutrition Data...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5" />
                      Generate AI Insights
                    </div>
                  )}
                </Button>

                {/* Regional Context Card */}
                {selectedRegion !== "all" && (
                  <Card className={`bg-gradient-to-r ${currentRegion.color} border-none text-white rounded-xl overflow-hidden relative shadow-md`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{currentRegion.emoji}</span>
                        <div>
                          <h3 className="font-bold text-xl">{currentRegion.name}</h3>
                          <p className="text-white/90 text-sm">{regionalContext}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="h-5 w-5" />
                            <span className="text-white/90 text-sm font-medium">Population</span>
                          </div>
                          <span className="font-bold text-lg">{currentRegion.population}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Activity className="h-5 w-5" />
                            <span className="text-white/90 text-sm font-medium">Stunting Rate</span>
                          </div>
                          <span className="font-bold text-lg text-yellow-200">{currentRegion.stuntingRate}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Target className="h-5 w-5" />
                            <span className="text-white/90 text-sm font-medium">Priority</span>
                          </div>
                          <span className="font-bold text-sm">{currentRegion.priority.slice(0, 20)}...</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Insight Display */}
                {(typewriterText || insight) && (
                  <Card className="border-none bg-white/90 dark:bg-slate-900/90 shadow-lg rounded-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400">
                          <Lightbulb className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">AI-Generated Insights</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Based on comprehensive nutrition data</p>
                        </div>
                        {isGenerating && (
                          <div className="ml-auto">
                            <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-teal-500 rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                          {typewriterText}
                          {isGenerating && typewriterText === insight && (
                            <span className="inline-block w-2 h-5 bg-teal-500 ml-1 animate-pulse"></span>
                          )}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Smart Questions */}
            <Card className="border-none shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-gray-100">
                  <Brain className="h-6 w-6 text-purple-500" />
                  Smart Questions
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Explore AI-optimized nutrition queries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {predefinedQuestions.map((q, index) => (
                    <div
                      key={index}
                      className="group relative p-4 rounded-lg bg-gradient-to-r from-teal-50/50 to-emerald-50/50 dark:from-teal-900/50 dark:to-emerald-900/50 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                      onClick={() => setQuestion(q)}
                      onKeyDown={(e) => e.key === 'Enter' && setQuestion(q)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select predefined question: ${q}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:from-teal-600 group-hover:to-emerald-600 transition-all">
                          <ChevronRight className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-relaxed">
                          {q}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insight History */}
            {insightHistory.length > 0 && (
              <Card className="border-none shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-gray-100">
                    <Activity className="h-6 w-6 text-teal-500" />
                    Recent Insights
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Your previous AI-generated insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insightHistory.map((item, index) => (
                      <div key={index} className="group hover:bg-teal-50 dark:hover:bg-teal-900/30 p-4 rounded-lg transition-colors border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="bg-teal-50 dark:bg-teal-900/50 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300">
                            {insightCategories.find(cat => cat.id === item.category)?.name}
                          </Badge>
                          <Badge variant="secondary" className="text-xs text-gray-600 dark:text-gray-300">
                            {regionalProfiles[item.region]?.emoji} {item.region === "all" ? "National" : item.region}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{item.timestamp.toLocaleString()}</span>
                        </div>
                        <p className="font-medium text-sm mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{item.question}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Insight Categories */}
            <Card className="border-none shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-gray-100">
                  <Target className="h-6 w-6 text-emerald-500" />
                  Analysis Categories
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Explore AI-powered analysis types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insightCategories.map((category) => {
                    const Icon = category.icon
                    const isSelected = selectedCategory === category.id
                    return (
                      <div 
                        key={category.id} 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/30 shadow-lg' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600'
                        }`}
                        onClick={() => handleCategorySelect(category.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCategorySelect(category.id)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select category: ${category.name}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-100 dark:bg-teal-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            <Icon className={`h-5 w-5 ${isSelected ? 'text-teal-600 dark:text-teal-300' : 'text-gray-600 dark:text-gray-400'}`} />
                          </div>
                          <div className="flex-1">
                            <span className={`font-semibold text-sm ${isSelected ? 'text-teal-600 dark:text-teal-300' : 'text-gray-800 dark:text-gray-200'}`}>
                              {category.name}
                            </span>
                            <p className={`text-xs ${isSelected ? 'text-teal-500 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card className="border-none shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-gray-100">
                  <MapPin className="h-6 w-6 text-orange-500" />
                  Data Sources
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">NISR datasets powering our insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Demographic Health Survey - Nutrition", status: "live", color: "green" },
                    { name: "Child Malnutrition Indicators 2023", status: "updated", color: "blue" },
                    { name: "Food Security & Vulnerability Analysis", status: "live", color: "green" },
                    { name: "Agricultural Household Survey", status: "processing", color: "yellow" }
                  ].map((source, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${
                        source.color === 'green' ? 'bg-green-500' :
                        source.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
                      } ${source.status === 'live' ? 'animate-pulse' : ''}`}></div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{source.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${
                            source.color === 'green' ? 'border-green-200 text-green-700 bg-green-50 dark:bg-green-900/30' :
                            source.color === 'blue' ? 'border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/30' : 
                            'border-yellow-200 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/30'
                          }`}>
                            {source.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}