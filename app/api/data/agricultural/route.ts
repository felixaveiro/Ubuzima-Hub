import type { NextRequest } from "next/server"

// Mock agricultural data - in a real app, this would come from NISR database
const agriculturalData = [
  {
    id: 1,
    district: "Kigali",
    crop: "Maize",
    area: 1250,
    yield: 2.8,
    farmers: 340,
    season: "2023A",
    province: "Kigali",
  },
  {
    id: 2,
    district: "Musanze",
    crop: "Irish Potato",
    area: 2100,
    yield: 15.2,
    farmers: 580,
    season: "2023A",
    province: "Northern",
  },
  {
    id: 3,
    district: "Huye",
    crop: "Beans",
    area: 890,
    yield: 1.9,
    farmers: 220,
    season: "2023A",
    province: "Southern",
  },
  {
    id: 4,
    district: "Nyagatare",
    crop: "Maize",
    area: 3200,
    yield: 3.1,
    farmers: 750,
    season: "2023A",
    province: "Eastern",
  },
  {
    id: 5,
    district: "Rubavu",
    crop: "Rice",
    area: 1800,
    yield: 4.2,
    farmers: 420,
    season: "2023A",
    province: "Western",
  },
  {
    id: 6,
    district: "Kayonza",
    crop: "Cassava",
    area: 2500,
    yield: 14.8,
    farmers: 680,
    season: "2023A",
    province: "Eastern",
  },
  {
    id: 7,
    district: "Gasabo",
    crop: "Vegetables",
    area: 450,
    yield: 8.5,
    farmers: 120,
    season: "2023A",
    province: "Kigali",
  },
  {
    id: 8,
    district: "Rwamagana",
    crop: "Maize",
    area: 1900,
    yield: 2.9,
    farmers: 480,
    season: "2023A",
    province: "Eastern",
  },
  {
    id: 9,
    district: "Muhanga",
    crop: "Beans",
    area: 1200,
    yield: 2.1,
    farmers: 310,
    season: "2023A",
    province: "Southern",
  },
  {
    id: 10,
    district: "Nyabihu",
    crop: "Irish Potato",
    area: 1600,
    yield: 14.5,
    farmers: 420,
    season: "2023A",
    province: "Western",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const district = searchParams.get("district")
  const crop = searchParams.get("crop")
  const province = searchParams.get("province")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  let filteredData = [...agriculturalData]

  // Apply filters
  if (district && district !== "all") {
    filteredData = filteredData.filter((item) => item.district.toLowerCase().includes(district.toLowerCase()))
  }

  if (crop && crop !== "all") {
    filteredData = filteredData.filter((item) => item.crop.toLowerCase().includes(crop.toLowerCase()))
  }

  if (province && province !== "all") {
    filteredData = filteredData.filter((item) => item.province.toLowerCase().includes(province.toLowerCase()))
  }

  // Apply pagination
  const paginatedData = filteredData.slice(offset, offset + limit)

  return Response.json({
    data: paginatedData,
    total: filteredData.length,
    limit,
    offset,
    hasMore: offset + limit < filteredData.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { district, crop, area, yield: yieldValue, farmers, season } = body

    // Validate required fields
    if (!district || !crop || !area || !yieldValue || !farmers || !season) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would save to database
    const newRecord = {
      id: agriculturalData.length + 1,
      district,
      crop,
      area: Number.parseFloat(area),
      yield: Number.parseFloat(yieldValue),
      farmers: Number.parseInt(farmers),
      season,
      province: "Unknown", // Would be determined from district mapping
    }

    return Response.json(
      {
        message: "Agricultural data recorded successfully",
        data: newRecord,
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }
}
