import type { NextRequest } from "next/server"

// Mock analytics data
const analyticsData = {
  totalFarmers: 2100000,
  totalArea: 1200000, // hectares
  averageYield: 6.4, // tons per hectare
  foodSecureHouseholds: 76, // percentage
  riskDistricts: 12,
  topCrops: [
    { crop: "Cassava", area: 280000, production: 4200000 },
    { crop: "Maize", area: 210000, production: 630000 },
    { crop: "Irish Potato", area: 180000, production: 2700000 },
    { crop: "Beans", area: 160000, production: 320000 },
    { crop: "Rice", area: 85000, production: 340000 },
  ],
  provinceStats: [
    { province: "Eastern", farmers: 520000, area: 310000, yield: 6.8 },
    { province: "Southern", farmers: 480000, area: 285000, yield: 6.2 },
    { province: "Western", farmers: 450000, area: 270000, yield: 6.1 },
    { province: "Northern", farmers: 380000, area: 220000, yield: 6.9 },
    { province: "Kigali", farmers: 270000, area: 115000, yield: 7.2 },
  ],
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const metric = searchParams.get("metric")
  const province = searchParams.get("province")

  let response = { ...analyticsData }

  // Filter by province if specified
  if (province && province !== "all") {
    const provinceData = analyticsData.provinceStats.find((p) => p.province.toLowerCase() === province.toLowerCase())

    if (provinceData) {
      response = {
        ...response,
        totalFarmers: provinceData.farmers,
        totalArea: provinceData.area,
        averageYield: provinceData.yield,
        provinceStats: [provinceData],
      }
    }
  }

  // Return specific metric if requested
  if (metric) {
    switch (metric) {
      case "farmers":
        return Response.json({ value: response.totalFarmers, unit: "farmers" })
      case "area":
        return Response.json({ value: response.totalArea, unit: "hectares" })
      case "yield":
        return Response.json({ value: response.averageYield, unit: "tons/hectare" })
      case "food-security":
        return Response.json({ value: response.foodSecureHouseholds, unit: "percentage" })
      default:
        return Response.json({ error: "Invalid metric" }, { status: 400 })
    }
  }

  return Response.json(response)
}
