"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet"
import L from "leaflet"

interface District {
  name: string
  province: string
  stunting: number
  wasting: number
  anemia: number
  foodSecurity: number
  coordinates: [number, number] // [lat, lng]
}

const rwandaDistricts: District[] = [
  // Northern Province
  { name: "Burera", province: "Northern", stunting: 30, wasting: 8, anemia: 14, foodSecurity: 78, coordinates: [-1.49, 29.88] },
  { name: "Gicumbi", province: "Northern", stunting: 28, wasting: 7, anemia: 13, foodSecurity: 82, coordinates: [-1.64, 30.06] },
  { name: "Gakenke", province: "Northern", stunting: 34, wasting: 9, anemia: 16, foodSecurity: 75, coordinates: [-1.68, 29.78] },
  { name: "Rulindo", province: "Northern", stunting: 32, wasting: 8, anemia: 15, foodSecurity: 77, coordinates: [-1.79, 30.06] },
  { name: "Musanze", province: "Northern", stunting: 31, wasting: 8, anemia: 15, foodSecurity: 79, coordinates: [-1.50, 29.63] },
  
  // Eastern Province
  { name: "Nyagatare", province: "Eastern", stunting: 38, wasting: 11, anemia: 19, foodSecurity: 68, coordinates: [-1.30, 30.33] },
  { name: "Gatsibo", province: "Eastern", stunting: 37, wasting: 10, anemia: 18, foodSecurity: 70, coordinates: [-1.60, 30.42] },
  { name: "Kayonza", province: "Eastern", stunting: 39, wasting: 12, anemia: 18, foodSecurity: 69, coordinates: [-1.89, 30.42] },
  { name: "Rwamagana", province: "Eastern", stunting: 42, wasting: 13, anemia: 20, foodSecurity: 65, coordinates: [-1.95, 30.43] },
  { name: "Kirehe", province: "Eastern", stunting: 36, wasting: 10, anemia: 17, foodSecurity: 72, coordinates: [-2.22, 30.72] },
  { name: "Ngoma", province: "Eastern", stunting: 25, wasting: 6, anemia: 12, foodSecurity: 85, coordinates: [-2.18, 30.53] },
  { name: "Bugesera", province: "Eastern", stunting: 35, wasting: 9, anemia: 16, foodSecurity: 73, coordinates: [-2.19, 30.20] },
  
  // Western Province
  { name: "Rubavu", province: "Western", stunting: 29, wasting: 7, anemia: 13, foodSecurity: 80, coordinates: [-1.68, 29.27] },
  { name: "Nyabihu", province: "Western", stunting: 33, wasting: 8, anemia: 15, foodSecurity: 76, coordinates: [-1.64, 29.51] },
  { name: "Ngororero", province: "Western", stunting: 35, wasting: 9, anemia: 16, foodSecurity: 74, coordinates: [-1.89, 29.55] },
  { name: "Rutsiro", province: "Western", stunting: 31, wasting: 8, anemia: 14, foodSecurity: 78, coordinates: [-2.07, 29.34] },
  { name: "Karongi", province: "Western", stunting: 35, wasting: 9, anemia: 16, foodSecurity: 74, coordinates: [-2.00, 29.40] },
  { name: "Nyamasheke", province: "Western", stunting: 33, wasting: 8, anemia: 15, foodSecurity: 76, coordinates: [-2.30, 29.13] },
  { name: "Rusizi", province: "Western", stunting: 34, wasting: 9, anemia: 16, foodSecurity: 75, coordinates: [-2.48, 28.91] },
  
  // Southern Province
  { name: "Nyaruguru", province: "Southern", stunting: 32, wasting: 8, anemia: 15, foodSecurity: 77, coordinates: [-2.60, 29.52] },
  { name: "Huye", province: "Southern", stunting: 28, wasting: 7, anemia: 13, foodSecurity: 81, coordinates: [-2.60, 29.74] },
  { name: "Nyanza", province: "Southern", stunting: 26, wasting: 6, anemia: 12, foodSecurity: 84, coordinates: [-2.35, 29.75] },
  { name: "Gisagara", province: "Southern", stunting: 33, wasting: 9, anemia: 15, foodSecurity: 76, coordinates: [-2.53, 29.83] },
  { name: "Nyamagabe", province: "Southern", stunting: 34, wasting: 9, anemia: 16, foodSecurity: 75, coordinates: [-2.53, 29.45] },
  { name: "Ruhango", province: "Southern", stunting: 30, wasting: 7, anemia: 14, foodSecurity: 79, coordinates: [-2.23, 29.78] },
  { name: "Muhanga", province: "Southern", stunting: 29, wasting: 7, anemia: 13, foodSecurity: 80, coordinates: [-2.08, 29.75] },
  { name: "Kamonyi", province: "Southern", stunting: 27, wasting: 6, anemia: 12, foodSecurity: 83, coordinates: [-2.04, 29.98] },
  
  // Kigali City
  { name: "Gasabo", province: "Kigali City", stunting: 20, wasting: 5, anemia: 10, foodSecurity: 88, coordinates: [-1.89, 30.09] },
  { name: "Kicukiro", province: "Kigali City", stunting: 19, wasting: 4, anemia: 9, foodSecurity: 90, coordinates: [-1.97, 30.10] },
  { name: "Nyarugenge", province: "Kigali City", stunting: 18, wasting: 4, anemia: 9, foodSecurity: 91, coordinates: [-1.95, 30.06] },
]

export default function RwandaMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Rwamagana")
  const [mapLoaded, setMapLoaded] = useState(false)

  const selectedDistrictData = rwandaDistricts.find(d => d.name === selectedDistrict)
  const topDistricts = [...rwandaDistricts].sort((a, b) => b.stunting - a.stunting).slice(0, 5)
  const trends = [
    { year: "DHS 2015", value: 38 },
    { year: "DHS 2017", value: 35 },
    { year: "DHS 2020", value: 32 },
    { year: "DHS 2023", value: 29 },
  ]
  const getColor = (stunting: number) => {
    if (stunting >= 35) return "#ef4444" // Red
    if (stunting >= 28) return "#fb923c" // Orange
    if (stunting >= 22) return "#fbbf24" // Yellow
    return "#22c55e" // Green
  }

  return (
    <div className="space-y-4 p-6 bg-white min-h-screen">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-sm">
          <CardContent className="pt-6 pb-5">
            <div className="text-sm text-slate-600 font-medium mb-2">Stunting (%)</div>
            <div className="text-5xl font-bold text-orange-500 mb-1">32%</div>
            <div className="text-xs text-slate-500">DHS 2020</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm">
          <CardContent className="pt-6 pb-5">
            <div className="text-sm text-slate-600 font-medium mb-2">Wasting (%)</div>
            <div className="text-5xl font-bold text-green-600 mb-1">9%</div>
            <div className="text-xs text-slate-500">DHS 2020</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-sm">
          <CardContent className="pt-6 pb-5">
            <div className="text-sm text-slate-600 font-medium mb-2">Anemia in women (%)</div>
            <div className="text-5xl font-bold text-orange-500 mb-1">16%</div>
            <div className="text-xs text-slate-500">DHS 2020</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Interactive Leaflet Map */}
        <div className="space-y-4">
          {/* Leaflet Map with all districts */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-700">
                Interactive Map - 30 Districts (Click markers for details)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-lg overflow-hidden border-2 border-slate-200" style={{ height: '500px' }}>
                {typeof window !== 'undefined' && (
                  // @ts-ignore
                  <MapContainer
                    // @ts-ignore
                    center={[-1.94, 30.06]}
                    zoom={8}
                    style={{ height: '100%', width: '100%' }}
                    whenReady={() => setMapLoaded(true)}
                  >
                    {/* @ts-ignore */}
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      // @ts-ignore
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {/* Add markers for all districts */}
                    {rwandaDistricts.map((district) => {
                      const customIcon = new L.DivIcon({
                        className: 'custom-div-icon',
                        html: `<div style="
                          background-color: ${getColor(district.stunting)};
                          width: 24px;
                          height: 24px;
                          border-radius: 50%;
                          border: 3px solid white;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          font-weight: bold;
                          font-size: 10px;
                          cursor: pointer;
                        ">${district.stunting}</div>`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                      })
                      return (
                        <Marker
                          key={district.name}
                          position={district.coordinates}
                          icon={customIcon}
                          eventHandlers={{
                            click: () => setSelectedDistrict(district.name)
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <div className="font-bold text-lg mb-2">{district.name}</div>
                              <div className="text-sm text-slate-600 mb-3">{district.province} Province</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <div className="font-semibold text-red-600">Stunting</div>
                                  <div className="text-lg font-bold">{district.stunting}%</div>
                                </div>
                                <div>
                                  <div className="font-semibold text-orange-600">Wasting</div>
                                  <div className="text-lg font-bold">{district.wasting}%</div>
                                </div>
                                <div>
                                  <div className="font-semibold text-purple-600">Anemia</div>
                                  <div className="text-lg font-bold">{district.anemia}%</div>
                                </div>
                                <div>
                                  <div className="font-semibold text-green-600">Food Security</div>
                                  <div className="text-lg font-bold">{district.foodSecurity}%</div>
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-slate-500 italic">Source: DHS 2020 / NISR</div>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    })}
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Selected District Info */}
          {selectedDistrictData && (
            <div className="mt-6 p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-xl text-slate-900">{selectedDistrictData.name}</div>
                  <div className="text-sm text-slate-600 font-medium">{selectedDistrictData.province} Province</div>
                </div>
                <Badge 
                  className="text-xs font-bold px-3 py-1"
                  style={{
                    backgroundColor: selectedDistrictData.stunting >= 35 ? "#ef4444" : 
                                   selectedDistrictData.stunting >= 28 ? "#fb923c" :
                                   selectedDistrictData.stunting >= 22 ? "#fbbf24" : "#22c55e",
                    color: "white"
                  }}
                >
                  {selectedDistrictData.stunting >= 35 ? "High Risk" : 
                   selectedDistrictData.stunting >= 28 ? "Moderate" :
                   selectedDistrictData.stunting >= 22 ? "Low-Moderate" : "Good"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-500 font-medium mb-1">Stunting</div>
                  <div className="text-2xl font-bold text-red-600">{selectedDistrictData.stunting}%</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-500 font-medium mb-1">Wasting</div>
                  <div className="text-2xl font-bold text-orange-600">{selectedDistrictData.wasting}%</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-500 font-medium mb-1">Anemia</div>
                  <div className="text-2xl font-bold text-purple-600">{selectedDistrictData.anemia}%</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-500 font-medium mb-1">Food Security</div>
                  <div className="text-2xl font-bold text-green-600">{selectedDistrictData.foodSecurity}%</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 italic">Source: DHS 2020 / NISR</div>
            </div>
          )}
        </div>
        {/* Right Column - District Details & Charts */}
        <div className="space-y-4">
          {/* Top Districts Chart */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-700">Districts with highest stunting</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topDistricts} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 60]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="stunting" fill="#ef4444" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trends Chart */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-700">Stunting in Rwanda</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trends} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis domain={[20, 45]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      {/* End grid row */}
      </div>

      {/* All Districts List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-700">All 30 Districts - Click to View Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {rwandaDistricts.map((district) => (
              <button
                key={district.name}
                onClick={() => setSelectedDistrict(district.name)}
                className={`px-3 py-2 rounded-lg font-medium text-xs text-white transition-all shadow-sm ${
                  selectedDistrict === district.name
                    ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-lg"
                    : "hover:scale-105 hover:shadow-md"
                }`}
                style={{ backgroundColor: getColor(district.stunting) }}
              >
                {district.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}