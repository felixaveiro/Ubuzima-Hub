import type { NextRequest } from "next/server"

// Mock nutrition data from NISR demographic health surveys
const nutritionData = [
  { id: 1, district: "Kigali", stunting: 18.2, wasting: 2.1, underweight: 11.5, year: 2023, province: "Kigali" },
  { id: 2, district: "Musanze", stunting: 22.8, wasting: 3.4, underweight: 14.2, year: 2023, province: "Northern" },
  { id: 3, district: "Huye", stunting: 20.5, wasting: 2.8, underweight: 12.8, year: 2023, province: "Southern" },
  { id: 4, district: "Nyagatare", stunting: 25.1, wasting: 4.1, underweight: 16.3, year: 2023, province: "Eastern" },
  { id: 5, district: "Rubavu", stunting: 23.7, wasting: 3.6, underweight: 15.1, year: 2023, province: "Western" },
  { id: 6, district: "Gasabo", stunting: 16.8, wasting: 1.9, underweight: 10.2, year: 2023, province: "Kigali" },
  { id: 7, district: "Rwamagana", stunting: 24.3, wasting: 3.8, underweight: 15.7, year: 2023, province: "Eastern" },
  { id: 8, district: "Muhanga", stunting: 21.2, wasting: 3.1, underweight: 13.4, year: 2023, province: "Southern" },
  { id: 9, district: "Nyabihu", stunting: 22.1, wasting: 3.2, underweight: 14.8, year: 2023, province: "Western" },
  { id: 10, district: "Burera", stunting: 26.4, wasting: 4.5, underweight: 17.2, year: 2023, province: "Northern" },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const district = searchParams.get("district")
  const province = searchParams.get("province")
  const year = searchParams.get("year")
  const indicator = searchParams.get("indicator") // stunting, wasting, underweight

  let filteredData = [...nutritionData]

  // Apply filters
  if (district && district !== "all") {
    filteredData = filteredData.filter((item) => item.district.toLowerCase().includes(district.toLowerCase()))
  }

  if (province && province !== "all") {
    filteredData = filteredData.filter((item) => item.province.toLowerCase().includes(province.toLowerCase()))
  }

  if (year) {
    filteredData = filteredData.filter((item) => item.year === Number.parseInt(year))
  }

  // Calculate summary statistics
  const summary = {
    totalDistricts: filteredData.length,
    averageStunting: filteredData.reduce((sum, item) => sum + item.stunting, 0) / filteredData.length,
    averageWasting: filteredData.reduce((sum, item) => sum + item.wasting, 0) / filteredData.length,
    averageUnderweight: filteredData.reduce((sum, item) => sum + item.underweight, 0) / filteredData.length,
    highRiskDistricts: filteredData.filter((item) => item.stunting > 25 || item.wasting > 4).length,
  }

  return Response.json({
    data: filteredData,
    summary,
    total: filteredData.length,
  })
}
