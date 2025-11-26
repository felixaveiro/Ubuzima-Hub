'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

interface DistrictData {
  name: string
  stunting: number
  wasting: number
  underweight: number
  anemia?: number
  foodSecurity?: number
  latitude: number
  longitude: number
  risk: 'high' | 'medium' | 'low'
}

const rwandaDistricts: DistrictData[] = [
  // Northern Province
  { name: 'Musanze', stunting: 28.5, wasting: 3.8, underweight: 18.2, anemia: 42, foodSecurity: 72, latitude: -1.494, longitude: 29.631, risk: 'high' },
  { name: 'Burera', stunting: 26.3, wasting: 3.2, underweight: 16.8, anemia: 38, foodSecurity: 75, latitude: -1.708, longitude: 29.757, risk: 'high' },
  { name: 'Gicumbi', stunting: 24.1, wasting: 2.9, underweight: 15.4, anemia: 35, foodSecurity: 78, latitude: -1.639, longitude: 30.176, risk: 'medium' },
  { name: 'Ruhengeri', stunting: 27.2, wasting: 3.5, underweight: 17.6, anemia: 40, foodSecurity: 73, latitude: -1.500, longitude: 29.650, risk: 'high' },
  
  // Eastern Province
  { name: 'Kayonza', stunting: 32.1, wasting: 4.5, underweight: 21.3, anemia: 48, foodSecurity: 68, latitude: -2.026, longitude: 30.888, risk: 'high' },
  { name: 'Kirehe', stunting: 31.8, wasting: 4.3, underweight: 20.8, anemia: 47, foodSecurity: 69, latitude: -2.273, longitude: 31.769, risk: 'high' },
  { name: 'Ngoma', stunting: 23.5, wasting: 2.7, underweight: 14.9, anemia: 32, foodSecurity: 82, latitude: -2.421, longitude: 30.271, risk: 'low' },
  { name: 'Nyagatare', stunting: 29.4, wasting: 3.9, underweight: 19.1, anemia: 44, foodSecurity: 71, latitude: -1.937, longitude: 30.393, risk: 'high' },
  { name: 'Gatsibo', stunting: 25.7, wasting: 3.1, underweight: 16.2, anemia: 36, foodSecurity: 76, latitude: -2.095, longitude: 30.419, risk: 'medium' },
  
  // Southern Province
  { name: 'Huye', stunting: 22.3, wasting: 2.5, underweight: 14.1, anemia: 31, foodSecurity: 83, latitude: -2.600, longitude: 29.740, risk: 'low' },
  { name: 'Gisagara', stunting: 24.8, wasting: 2.8, underweight: 15.7, anemia: 34, foodSecurity: 79, latitude: -2.825, longitude: 29.602, risk: 'medium' },
  { name: 'Nyaruguru', stunting: 26.1, wasting: 3.0, underweight: 16.5, anemia: 37, foodSecurity: 77, latitude: -2.845, longitude: 29.302, risk: 'medium' },
  { name: 'Nyanza', stunting: 21.5, wasting: 2.3, underweight: 13.2, anemia: 29, foodSecurity: 85, latitude: -2.370, longitude: 29.738, risk: 'low' },
  { name: 'Muhanga', stunting: 19.8, wasting: 2.0, underweight: 12.1, anemia: 26, foodSecurity: 87, latitude: -1.945, longitude: 30.027, risk: 'low' },
  
  // Western Province
  { name: 'Karongi', stunting: 28.2, wasting: 3.7, underweight: 18.0, anemia: 41, foodSecurity: 74, latitude: -2.065, longitude: 29.257, risk: 'high' },
  { name: 'Nyamasheke', stunting: 27.9, wasting: 3.6, underweight: 17.8, anemia: 40, foodSecurity: 74, latitude: -2.464, longitude: 28.857, risk: 'high' },
  { name: 'Rusizi', stunting: 26.7, wasting: 3.3, underweight: 17.0, anemia: 38, foodSecurity: 76, latitude: -2.506, longitude: 29.006, risk: 'medium' },
  { name: 'Rutsiro', stunting: 25.4, wasting: 3.0, underweight: 16.0, anemia: 35, foodSecurity: 78, latitude: -1.923, longitude: 29.226, risk: 'medium' },
  { name: 'Rubavu', stunting: 23.6, wasting: 2.6, underweight: 15.0, anemia: 33, foodSecurity: 80, latitude: -1.692, longitude: 29.238, risk: 'low' },
  
  // Kigali
  { name: 'Kigali', stunting: 16.2, wasting: 1.8, underweight: 9.5, anemia: 22, foodSecurity: 92, latitude: -1.950, longitude: 30.060, risk: 'low' },
  { name: 'Gasabo', stunting: 17.5, wasting: 1.9, underweight: 10.2, anemia: 24, foodSecurity: 90, latitude: -1.870, longitude: 30.135, risk: 'low' },
  { name: 'Kicukiro', stunting: 18.1, wasting: 2.0, underweight: 10.8, anemia: 25, foodSecurity: 88, latitude: -2.000, longitude: 30.060, risk: 'low' },
]

export function RwandaMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600'
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'low':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500'
    }
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getIndicatorColor = (value: number, indicator: string) => {
    if (indicator === 'foodSecurity') {
      return value >= 85 ? 'text-green-600' : value >= 75 ? 'text-yellow-600' : 'text-red-600'
    }
    // For stunting, wasting, underweight, anemia - higher is worse
    return value >= 28 ? 'text-red-600' : value >= 20 ? 'text-yellow-600' : 'text-green-600'
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Rwanda Nutrition Indicators Map
        </h2>
        <p className="text-gray-600 mb-4 max-w-3xl mx-auto">
          Interactive visualization of nutrition indicators across Rwanda's 30 districts. 
          Click on a district to view detailed analysis and predictive insights.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-700">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-700">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Low Risk</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <CardContent className="p-6">
              <div className="relative w-full aspect-square md:aspect-video bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
                {/* Interactive District Grid */}
                <div className="w-full h-full p-4 flex flex-wrap items-center justify-center gap-2 content-start">
                  {rwandaDistricts.map((district) => (
                    <button
                      key={district.name}
                      onClick={() => setSelectedDistrict(district)}
                      onMouseEnter={() => setHoveredDistrict(district.name)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white
                        transition-all duration-200 transform hover:scale-125 cursor-pointer
                        ${getRiskColor(district.risk)}
                        ${hoveredDistrict === district.name || selectedDistrict?.name === district.name ? 'ring-2 ring-offset-2 ring-gray-800' : ''}
                      `}
                      title={district.name}
                    >
                      {district.name.slice(0, 2).toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Legend Text */}
                <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                  Click on a district for details
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div>
          {selectedDistrict ? (
            <Card className="h-full bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedDistrict.name}</span>
                  <Badge className={`${getRiskBadgeColor(selectedDistrict.risk)} border`}>
                    {selectedDistrict.risk.toUpperCase()} RISK
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nutrition Indicators */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#005BAC]"></span>
                    Nutrition Indicators
                  </h3>
                  
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Stunting:</span>
                      <span className={`font-semibold ${getIndicatorColor(selectedDistrict.stunting, 'stunting')}`}>
                        {selectedDistrict.stunting.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full" 
                        style={{width: `${Math.min((selectedDistrict.stunting / 35) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Wasting:</span>
                      <span className={`font-semibold ${getIndicatorColor(selectedDistrict.wasting, 'wasting')}`}>
                        {selectedDistrict.wasting.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-orange-500 h-1.5 rounded-full" 
                        style={{width: `${Math.min((selectedDistrict.wasting / 5) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Underweight:</span>
                      <span className={`font-semibold ${getIndicatorColor(selectedDistrict.underweight, 'underweight')}`}>
                        {selectedDistrict.underweight.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-500 h-1.5 rounded-full" 
                        style={{width: `Math.min((selectedDistrict.underweight / 25) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Anemia:</span>
                      <span className={`font-semibold ${getIndicatorColor(selectedDistrict.anemia || 0, 'anemia')}`}>
                        {selectedDistrict.anemia}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-pink-500 h-1.5 rounded-full" 
                        style={{width: `${Math.min(((selectedDistrict.anemia || 0) / 50) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Food Security:</span>
                      <span className={`font-semibold ${getIndicatorColor(selectedDistrict.foodSecurity || 0, 'foodSecurity')}`}>
                        {selectedDistrict.foodSecurity}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{width: `${Math.min(((selectedDistrict.foodSecurity || 0) / 100) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">Recommendation</h4>
                  <p className="text-xs text-blue-800">
                    {selectedDistrict.risk === 'high' 
                      ? 'Immediate intervention required. Prioritize maternal nutrition education and micronutrient supplementation programs.'
                      : selectedDistrict.risk === 'medium'
                      ? 'Enhanced monitoring recommended. Consider targeted food security measures and nutrition awareness campaigns.'
                      : 'Maintain current programs and continue monitoring indicators for early warning signs.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-200 flex items-center justify-center">
              <CardContent>
                <div className="text-center text-gray-500">
                  <ArrowRight className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-semibold">Select a district</p>
                  <p className="text-sm mt-2">Click on any district to view detailed nutrition indicators and predictive analysis.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* District List */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle>All Districts - Nutrition Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rwandaDistricts.map((district) => (
              <button
                key={district.name}
                onClick={() => setSelectedDistrict(district)}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-[#005BAC] hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{district.name}</span>
                  <Badge className={`${getRiskBadgeColor(district.risk)} border text-xs`}>
                    {district.risk.charAt(0).toUpperCase() + district.risk.slice(1)}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Stunting: <span className="font-medium">{district.stunting.toFixed(1)}%</span></div>
                  <div>Wasting: <span className="font-medium">{district.wasting.toFixed(1)}%</span></div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
