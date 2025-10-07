import type { NextRequest } from "next/server"

// Mock agricultural alerts data
const alertsData = [
  {
    id: 1,
    type: "drought",
    severity: "high",
    district: "Nyagatare",
    province: "Eastern",
    title: "Drought Risk Alert",
    description: "Low rainfall levels detected. Immediate irrigation recommended for maize and bean crops.",
    affectedCrops: ["Maize", "Beans"],
    recommendations: [
      "Implement drip irrigation systems",
      "Switch to drought-resistant crop varieties",
      "Harvest rainwater for future use",
    ],
    createdAt: "2024-01-10T08:00:00Z",
    status: "active",
  },
  {
    id: 2,
    type: "pest",
    severity: "medium",
    district: "Musanze",
    province: "Northern",
    title: "Fall Armyworm Detection",
    description: "Fall armyworm activity reported in maize fields. Early intervention required.",
    affectedCrops: ["Maize"],
    recommendations: ["Apply biological control agents", "Use pheromone traps", "Implement crop rotation"],
    createdAt: "2024-01-12T14:30:00Z",
    status: "active",
  },
  {
    id: 3,
    type: "market",
    severity: "low",
    district: "Kigali",
    province: "Kigali",
    title: "Price Volatility Warning",
    description: "Irish potato prices showing unusual fluctuations. Monitor market conditions.",
    affectedCrops: ["Irish Potato"],
    recommendations: ["Consider storage options", "Diversify marketing channels", "Monitor price trends daily"],
    createdAt: "2024-01-14T10:15:00Z",
    status: "monitoring",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const district = searchParams.get("district")
  const province = searchParams.get("province")
  const type = searchParams.get("type")
  const severity = searchParams.get("severity")
  const status = searchParams.get("status")

  let filteredData = [...alertsData]

  // Apply filters
  if (district && district !== "all") {
    filteredData = filteredData.filter((item) => item.district.toLowerCase().includes(district.toLowerCase()))
  }

  if (province && province !== "all") {
    filteredData = filteredData.filter((item) => item.province.toLowerCase().includes(province.toLowerCase()))
  }

  if (type && type !== "all") {
    filteredData = filteredData.filter((item) => item.type === type)
  }

  if (severity && severity !== "all") {
    filteredData = filteredData.filter((item) => item.severity === severity)
  }

  if (status && status !== "all") {
    filteredData = filteredData.filter((item) => item.status === status)
  }

  // Sort by creation date (newest first)
  filteredData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const summary = {
    total: filteredData.length,
    high: filteredData.filter((item) => item.severity === "high").length,
    medium: filteredData.filter((item) => item.severity === "medium").length,
    low: filteredData.filter((item) => item.severity === "low").length,
    active: filteredData.filter((item) => item.status === "active").length,
  }

  return Response.json({
    data: filteredData,
    summary,
    total: filteredData.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, severity, district, province, title, description, affectedCrops, recommendations } = body

    // Validate required fields
    if (!type || !severity || !district || !title || !description) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newAlert = {
      id: alertsData.length + 1,
      type,
      severity,
      district,
      province: province || "Unknown",
      title,
      description,
      affectedCrops: affectedCrops || [],
      recommendations: recommendations || [],
      createdAt: new Date().toISOString(),
      status: "active",
    }

    return Response.json(
      {
        message: "Alert created successfully",
        data: newAlert,
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }
}
