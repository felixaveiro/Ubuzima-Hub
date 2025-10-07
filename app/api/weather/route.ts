import type { NextRequest } from "next/server"

// Mock weather data for Rwanda
const weatherData = [
  {
    id: 1,
    district: "Kigali",
    date: "2024-01-15",
    temperature: 24.5,
    humidity: 68,
    rainfall: 2.3,
    windSpeed: 8.2,
    province: "Kigali",
  },
  {
    id: 2,
    district: "Musanze",
    date: "2024-01-15",
    temperature: 18.7,
    humidity: 75,
    rainfall: 5.1,
    windSpeed: 12.4,
    province: "Northern",
  },
  {
    id: 3,
    district: "Huye",
    date: "2024-01-15",
    temperature: 21.2,
    humidity: 72,
    rainfall: 3.8,
    windSpeed: 9.6,
    province: "Southern",
  },
  {
    id: 4,
    district: "Nyagatare",
    date: "2024-01-15",
    temperature: 26.8,
    humidity: 62,
    rainfall: 1.2,
    windSpeed: 7.3,
    province: "Eastern",
  },
  {
    id: 5,
    district: "Rubavu",
    date: "2024-01-15",
    temperature: 20.4,
    humidity: 78,
    rainfall: 4.6,
    windSpeed: 11.8,
    province: "Western",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const district = searchParams.get("district")
  const province = searchParams.get("province")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  let filteredData = [...weatherData]

  // Apply filters
  if (district && district !== "all") {
    filteredData = filteredData.filter((item) => item.district.toLowerCase().includes(district.toLowerCase()))
  }

  if (province && province !== "all") {
    filteredData = filteredData.filter((item) => item.province.toLowerCase().includes(province.toLowerCase()))
  }

  if (startDate) {
    filteredData = filteredData.filter((item) => item.date >= startDate)
  }

  if (endDate) {
    filteredData = filteredData.filter((item) => item.date <= endDate)
  }

  // Calculate weather summary
  const summary = {
    averageTemperature: filteredData.reduce((sum, item) => sum + item.temperature, 0) / filteredData.length,
    averageHumidity: filteredData.reduce((sum, item) => sum + item.humidity, 0) / filteredData.length,
    totalRainfall: filteredData.reduce((sum, item) => sum + item.rainfall, 0),
    averageWindSpeed: filteredData.reduce((sum, item) => sum + item.windSpeed, 0) / filteredData.length,
    optimalConditions: filteredData.filter(
      (item) => item.temperature >= 20 && item.temperature <= 25 && item.humidity >= 60 && item.humidity <= 80,
    ).length,
  }

  return Response.json({
    data: filteredData,
    summary,
    total: filteredData.length,
  })
}
