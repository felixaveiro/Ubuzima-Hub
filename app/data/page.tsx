"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts"
import { 
  Database, 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  MapPin, 
  FileSpreadsheet,
  BarChart3,
  Activity,
  Users,
  Zap,
  Calendar,
  Globe,
  ArrowUpRight,
  Eye,
  Share2,
  RefreshCw,
  Settings,
  Info,
  ChevronRight,
  Star,
  Clock,
  Shield
} from "lucide-react"

// Mock NISR dataset samples
const agriculturalSurveyData = [
  { id: 1, district: "Kigali", crop: "Maize", area: 1250, yield: 2.8, farmers: 340, season: "2023A", production: 3500 },
  { id: 2, district: "Musanze", crop: "Irish Potato", area: 2100, yield: 15.2, farmers: 580, season: "2023A", production: 31920 },
  { id: 3, district: "Huye", crop: "Beans", area: 890, yield: 1.9, farmers: 220, season: "2023A", production: 1691 },
  { id: 4, district: "Nyagatare", crop: "Maize", area: 3200, yield: 3.1, farmers: 750, season: "2023A", production: 9920 },
  { id: 5, district: "Rubavu", crop: "Rice", area: 1800, yield: 4.2, farmers: 420, season: "2023A", production: 7560 },
  { id: 6, district: "Kayonza", crop: "Cassava", area: 2500, yield: 14.8, farmers: 680, season: "2023A", production: 37000 },
  { id: 7, district: "Gatsibo", crop: "Maize", area: 2800, yield: 2.9, farmers: 650, season: "2023A", production: 8120 },
  { id: 8, district: "Muhanga", crop: "Beans", area: 1200, yield: 2.1, farmers: 300, season: "2023A", production: 2520 },
]

const nutritionData = [
  { district: "Kigali", stunting: 18.2, wasting: 2.1, underweight: 11.5, year: 2023, households: 1250 },
  { district: "Northern", stunting: 22.8, wasting: 3.4, underweight: 14.2, year: 2023, households: 2100 },
  { district: "Southern", stunting: 20.5, wasting: 2.8, underweight: 12.8, year: 2023, households: 1890 },
  { district: "Eastern", stunting: 25.1, wasting: 4.1, underweight: 16.3, year: 2023, households: 2340 },
  { district: "Western", stunting: 23.7, wasting: 3.6, underweight: 15.1, year: 2023, households: 1980 },
]

const marketData = [
  { date: "2024-01", maize: 420, rice: 850, beans: 1150, potato: 310, month: "Jan" },
  { date: "2024-02", maize: 435, rice: 870, beans: 1200, potato: 325, month: "Feb" },
  { date: "2024-03", maize: 450, rice: 840, beans: 1180, potato: 340, month: "Mar" },
  { date: "2024-04", maize: 465, rice: 820, beans: 1220, potato: 355, month: "Apr" },
  { date: "2024-05", maize: 480, rice: 800, beans: 1250, potato: 370, month: "May" },
  { date: "2024-06", maize: 470, rice: 830, beans: 1280, potato: 360, month: "Jun" },
  { date: "2024-07", maize: 485, rice: 810, beans: 1300, potato: 375, month: "Jul" },
  { date: "2024-08", maize: 490, rice: 840, beans: 1320, potato: 380, month: "Aug" },
]

const datasetStats = {
  agricultural: { records: 6847, size: "45.2 MB", lastUpdate: "2024-09-15", downloads: 1247 },
  nutrition: { records: 2341, size: "18.7 MB", lastUpdate: "2024-08-20", downloads: 892 },
  market: { records: 1892, size: "12.4 MB", lastUpdate: "2024-09-20", downloads: 654 }
}

const cropDistribution = [
  { name: "Maize", value: 35, color: "#3B82F6" },
  { name: "Rice", value: 20, color: "#10B981" },
  { name: "Beans", value: 18, color: "#F59E0B" },
  { name: "Potato", value: 15, color: "#8B5CF6" },
  { name: "Cassava", value: 12, color: "#EF4444" },
]

const yieldTrends = [
  { year: "2020", maize: 2.5, rice: 3.8, beans: 1.6, potato: 12.5 },
  { year: "2021", maize: 2.7, rice: 4.0, beans: 1.8, potato: 13.2 },
  { year: "2022", maize: 2.9, rice: 4.1, beans: 1.9, potato: 14.1 },
  { year: "2023", maize: 3.0, rice: 4.2, beans: 2.0, potato: 15.0 },
]

export default function DataExplorer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [filteredData, setFilteredData] = useState(agriculturalSurveyData)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState("table")

  useEffect(() => {
    let filtered = agriculturalSurveyData

    if (selectedDistrict !== "all") {
      filtered = filtered.filter((item) => item.district === selectedDistrict)
    }

    if (selectedCrop !== "all") {
      filtered = filtered.filter((item) => item.crop === selectedCrop)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.crop.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredData(filtered)
  }, [searchTerm, selectedDistrict, selectedCrop])

  const downloadData = (format: string) => {
    setIsLoading(true)
    setTimeout(() => {
      console.log(`Downloading data in ${format} format`)
      alert(`Data download initiated in ${format} format`)
      setIsLoading(false)
    }, 1500)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedDistrict("all")
    setSelectedCrop("all")
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xl">
          <p className="font-semibold text-slate-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${entry.name.includes('Yield') ? ' T/Ha' : entry.name.includes('Area') ? ' Ha' : ''}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Enhanced Navigation Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    NISR Data Explorer
                  </h1>
                  <p className="text-sm text-slate-600">National Institute of Statistics Rwanda</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Live Data
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 shadow-sm">
                <Globe className="h-3 w-3 mr-1" />
                Open Access
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 shadow-sm">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-3xl p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -ml-36 -mb-36"></div>
          
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-indigo-200 font-medium text-sm uppercase tracking-wide">
                    Comprehensive Data Platform
                  </span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold leading-tight">
                    Explore Rwanda's
                    <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      Data Universe
                    </span>
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                    Access, analyze, and download official government datasets from Rwanda's 
                    national surveys and census programs. All data verified and quality-assured by NISR.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-200">2017-2024 Coverage</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-slate-200">30 Districts</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-slate-200">Updated Daily</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-white">11,080</div>
                    <div className="text-slate-300 text-sm uppercase tracking-wide">Total Records</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-emerald-400">76.3MB</div>
                    <div className="text-slate-300 text-xs">Dataset Size</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-blue-400">2.8K</div>
                    <div className="text-slate-300 text-xs">Downloads</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Dataset Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Primary Dataset
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 mb-2">Agricultural Survey</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                Comprehensive household agricultural survey covering crop production, livestock, and farming practices across all 30 districts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-2xl font-bold text-blue-600">{datasetStats.agricultural.records.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Records</div>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-2xl font-bold text-indigo-600">{datasetStats.agricultural.size}</div>
                  <div className="text-sm text-slate-600">File Size</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {datasetStats.agricultural.lastUpdate}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-slate-500">
                  <Download className="h-3 w-3" />
                  <span>{datasetStats.agricultural.downloads}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl border-slate-200 hover:bg-blue-50">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl border-slate-200 hover:bg-indigo-50">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Health Data
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 mb-2">Nutrition Indicators</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                Child malnutrition, food security, and dietary diversity indicators from national health surveys and DHS programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-2xl font-bold text-emerald-600">{datasetStats.nutrition.records.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Records</div>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-green-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-2xl font-bold text-green-600">{datasetStats.nutrition.size}</div>
                  <div className="text-sm text-slate-600">File Size</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {datasetStats.nutrition.lastUpdate}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-slate-500">
                  <Download className="h-3 w-3" />
                  <span>{datasetStats.nutrition.downloads}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl border-slate-200 hover:bg-emerald-50">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl border-slate-200 hover:bg-green-50">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-600/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Economic Data
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 mb-2">Market Analysis</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                Commodity prices, market trends, and trade flow data from national market information systems and trading centers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-2xl font-bold text-amber-600">{datasetStats.market.records.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Records</div>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-orange-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-2xl font-bold text-orange-600">{datasetStats.market.size}</div>
                  <div className="text-sm text-slate-600">File Size</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {datasetStats.market.lastUpdate}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-slate-500">
                  <Download className="h-3 w-3" />
                  <span>{datasetStats.market.downloads}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl border-slate-200 hover:bg-amber-50">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl border-slate-200 hover:bg-orange-50">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">2,370</div>
            <div className="text-sm text-slate-600">Active Farmers</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">14,540</div>
            <div className="text-sm text-slate-600">Total Hectares</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">91,313</div>
            <div className="text-sm text-slate-600">Total Production (MT)</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">30</div>
            <div className="text-sm text-slate-600">Districts Covered</div>
          </div>
        </div>

        {/* Enhanced Data Explorer Interface */}
        <Card className="border border-slate-200 bg-white shadow-2xl rounded-3xl overflow-hidden">
          <Tabs defaultValue="agricultural" className="w-full">
            <div className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/30 border-b border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Interactive Data Explorer
                  </h3>
                  <p className="text-slate-600">Explore, filter, and analyze Rwanda's official datasets with advanced visualization tools</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share View
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>
              
              <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
                <TabsTrigger
                  value="agricultural"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Agricultural Data
                </TabsTrigger>
                <TabsTrigger
                  value="nutrition"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Nutrition Data
                </TabsTrigger>
                <TabsTrigger
                  value="markets"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Market Data
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="agricultural" className="p-8 space-y-8">
              {/* Enhanced Filters */}
              <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Filter className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Data Filters & Controls</CardTitle>
                      <CardDescription className="text-slate-600">
                        Customize your data view with advanced filtering options
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search districts, crops, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                      />
                    </div>

                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger className="h-12 bg-white border-slate-300 rounded-xl shadow-sm">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        <SelectItem value="Kigali">Kigali</SelectItem>
                        <SelectItem value="Musanze">Musanze</SelectItem>
                        <SelectItem value="Huye">Huye</SelectItem>
                        <SelectItem value="Nyagatare">Nyagatare</SelectItem>
                        <SelectItem value="Rubavu">Rubavu</SelectItem>
                        <SelectItem value="Kayonza">Kayonza</SelectItem>
                        <SelectItem value="Gatsibo">Gatsibo</SelectItem>
                        <SelectItem value="Muhanga">Muhanga</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                      <SelectTrigger className="h-12 bg-white border-slate-300 rounded-xl shadow-sm">
                        <SelectValue placeholder="Select Crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Crops</SelectItem>
                        <SelectItem value="Maize">Maize</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Beans">Beans</SelectItem>
                        <SelectItem value="Irish Potato">Irish Potato</SelectItem>
                        <SelectItem value="Cassava">Cassava</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => downloadData("CSV")} 
                        variant="outline" 
                        className="flex-1 h-12 rounded-xl border-slate-300 hover:bg-blue-50 shadow-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                        CSV
                      </Button>
                      <Button 
                        onClick={() => downloadData("JSON")} 
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-slate-300 hover:bg-indigo-50 shadow-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                        JSON
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-slate-600">
                      <span className="font-medium">
                        Showing {filteredData.length} of {agriculturalSurveyData.length} records
                      </span>
                      <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
                        2023A Season
                      </Badge>
                      <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                        <Activity className="h-3 w-3 mr-1" />
                        Live Data
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      onClick={resetFilters}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Data Visualization Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border border-slate-200 bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-900">Crop Distribution</CardTitle>
                        <CardDescription className="text-slate-600">
                          Distribution of crops by cultivated area
                        </CardDescription>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={cropDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {cropDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border border-slate-200 bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-900">Yield Trends</CardTitle>
                        <CardDescription className="text-slate-600">
                          4-year yield performance by crop type
                        </CardDescription>
                      </div>
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={yieldTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="year" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="maize" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
                          <Line type="monotone" dataKey="rice" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
                          <Line type="monotone" dataKey="beans" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
                          <Line type="monotone" dataKey="potato" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Data Table */}
              <Card className="shadow-2xl border border-slate-200 bg-white">
                <CardHeader className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">Agricultural Survey Dataset</CardTitle>
                      <CardDescription className="text-slate-600 mt-2">
                        Comprehensive crop production data from the 2023A agricultural season across all districts
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        <Button
                          variant={viewMode === "table" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("table")}
                          className="h-8 px-3 rounded-md"
                        >
                          Table
                        </Button>
                        <Button
                          variant={viewMode === "chart" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("chart")}
                          className="h-8 px-3 rounded-md"
                        >
                          Chart
                        </Button>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Database className="h-3 w-3 mr-1" />
                        NISR Verified
                      </Badge>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Quality Assured
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {viewMode === "table" ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="text-left py-4 px-6 font-semibold text-slate-700">District</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Crop Type</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Area (Ha)</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Yield (T/Ha)</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Farmers</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Production (MT)</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-700">Season</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredData.map((item, index) => (
                            <tr key={item.id} className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-slate-400" />
                                  <span className="font-medium text-slate-900">{item.district}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-300">
                                  {item.crop}
                                </Badge>
                              </td>
                              <td className="py-4 px-6 text-slate-700 font-medium">{item.area.toLocaleString()}</td>
                              <td className="py-4 px-6 text-slate-700 font-medium">{item.yield}</td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-slate-400" />
                                  <span className="text-slate-700 font-medium">{item.farmers}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-slate-700 font-medium">{item.production.toLocaleString()}</td>
                              <td className="py-4 px-6">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {item.season}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="district" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="area" fill="#3b82f6" name="Area (Ha)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="production" fill="#10b981" name="Production (MT)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Productivity Analysis */}
              <Card className="shadow-lg border border-slate-200 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Productivity Analysis</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">
                        Relationship between farm size and crop yield across different districts
                      </CardDescription>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" dataKey="area" name="Area" unit=" Ha" stroke="#64748b" />
                        <YAxis type="number" dataKey="yield" name="Yield" unit=" T/Ha" stroke="#64748b" />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xl">
                                  <p className="font-semibold text-slate-900">{data.district}</p>
                                  <p className="text-sm text-slate-600">{data.crop}</p>
                                  <p className="text-sm" style={{ color: '#3b82f6' }}>
                                    Area: {data.area} Ha
                                  </p>
                                  <p className="text-sm" style={{ color: '#10b981' }}>
                                    Yield: {data.yield} T/Ha
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    Farmers: {data.farmers}
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Scatter name="Crops" dataKey="yield" fill="#3b82f6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="p-8 space-y-8">
              {/* Nutrition Overview */}
              <Card className="shadow-lg border border-slate-200 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Nutrition Indicators Dashboard</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">
                        Child malnutrition indicators across Rwanda's provinces (2023)
                      </CardDescription>
                    </div>
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={nutritionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="district" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="stunting" fill="#ef4444" name="Stunting %" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="wasting" fill="#f59e0b" name="Wasting %" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="underweight" fill="#8b5cf6" name="Underweight %" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Nutrition Data Table */}
              <Card className="shadow-lg border border-slate-200 bg-white">
                <CardHeader className="bg-gradient-to-r from-white via-emerald-50/30 to-green-50/30 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Detailed Nutrition Data</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">
                        Comprehensive malnutrition indicators by region
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      DHS 2023 Survey
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Region</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Stunting %</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Wasting %</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Underweight %</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Households</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {nutritionData.map((item, index) => (
                          <tr key={index} className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                <span className="font-medium text-slate-900">{item.district}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-slate-700 font-medium">{item.stunting}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                <span className="text-slate-700 font-medium">{item.wasting}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-slate-700 font-medium">{item.underweight}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-slate-700 font-medium">{item.households.toLocaleString()}</td>
                            <td className="py-4 px-6">
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                {item.year}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="markets" className="p-8 space-y-8">
              {/* Market Trends */}
              <Card className="shadow-lg border border-slate-200 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Commodity Price Trends</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">
                        Monthly price movements for key agricultural commodities (RWF/Kg)
                      </CardDescription>
                    </div>
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketData}>
                        <defs>
                          <linearGradient id="colorMaize" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorRice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorBeans" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorPotato" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="maize" stackId="1" stroke="#3b82f6" fill="url(#colorMaize)" />
                        <Area type="monotone" dataKey="rice" stackId="2" stroke="#10b981" fill="url(#colorRice)" />
                        <Area type="monotone" dataKey="beans" stackId="3" stroke="#f59e0b" fill="url(#colorBeans)" />
                        <Area type="monotone" dataKey="potato" stackId="4" stroke="#8b5cf6" fill="url(#colorPotato)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Market Data Table */}
              <Card className="shadow-lg border border-slate-200 bg-white">
                <CardHeader className="bg-gradient-to-r from-white via-amber-50/30 to-orange-50/30 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Market Price Data</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">
                        Monthly commodity prices from national market information system
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      RALIS Market Data
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Month</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Maize (RWF/Kg)</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Rice (RWF/Kg)</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Beans (RWF/Kg)</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Potato (RWF/Kg)</th>
                          <th className="text-left py-4 px-6 font-semibold text-slate-700">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {marketData.map((item, index) => (
                          <tr key={index} className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="font-medium text-slate-900">{item.month} 2024</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-slate-700 font-medium">{item.maize.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <span className="text-slate-700 font-medium">{item.rice.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                <span className="text-slate-700 font-medium">{item.beans.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-slate-700 font-medium">{item.potato.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-1">
                                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                                  Rising
                                </Badge>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Highest Growth
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 mb-1">+16.7%</div>
                    <div className="text-sm text-slate-600 mb-3">Maize Price Increase</div>
                    <p className="text-sm text-slate-700">
                      Maize prices showed the highest growth rate over the past 8 months, driven by seasonal demand patterns.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Most Stable
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 mb-1">±2.3%</div>
                    <div className="text-sm text-slate-600 mb-3">Rice Price Volatility</div>
                    <p className="text-sm text-slate-700">
                      Rice prices remained the most stable among all commodities, with minimal seasonal fluctuations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Premium Crop
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 mb-1">1,280</div>
                    <div className="text-sm text-slate-600 mb-3">RWF/Kg Beans Peak</div>
                    <p className="text-sm text-slate-700">
                      Beans reached their highest price point in June, reflecting strong export demand and quality premiums.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Data Quality</h4>
                  <p className="text-sm text-slate-600">NISR Certified</p>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                All datasets are verified and quality-assured by the National Institute of Statistics of Rwanda, 
                ensuring accuracy and reliability for research and policy making.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Open Access</h4>
                  <p className="text-sm text-slate-600">Free & Public</p>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                Our commitment to transparency means all government data is freely accessible to researchers, 
                students, and the public for educational and research purposes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Data Security</h4>
                  <p className="text-sm text-slate-600">Protected & Secure</p>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                We maintain the highest standards of data security and privacy protection while ensuring 
                public access to aggregated, non-sensitive information.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="text-sm text-slate-600">
                © 2024 National Institute of Statistics of Rwanda. All rights reserved.
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="text-slate-600 border-slate-300">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="outline" size="sm" className="text-slate-600 border-slate-300">
                  <Info className="h-4 w-4 mr-2" />
                  API Access
                </Button>
                <Button variant="outline" size="sm" className="text-slate-600 border-slate-300">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}