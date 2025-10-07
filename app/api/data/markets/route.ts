import type { NextRequest } from "next/server"

// Mock market price data
const marketData = [
  { id: 1, date: "2024-01", commodity: "Maize", price: 420, market: "Kigali", unit: "kg" },
  { id: 2, date: "2024-01", commodity: "Rice", price: 850, market: "Kigali", unit: "kg" },
  { id: 3, date: "2024-01", commodity: "Beans", price: 1150, market: "Kigali", unit: "kg" },
  { id: 4, date: "2024-01", commodity: "Irish Potato", price: 310, market: "Kigali", unit: "kg" },
  { id: 5, date: "2024-02", commodity: "Maize", price: 435, market: "Kigali", unit: "kg" },
  { id: 6, date: "2024-02", commodity: "Rice", price: 870, market: "Kigali", unit: "kg" },
  { id: 7, date: "2024-02", commodity: "Beans", price: 1200, market: "Kigali", unit: "kg" },
  { id: 8, date: "2024-02", commodity: "Irish Potato", price: 325, market: "Kigali", unit: "kg" },
  { id: 9, date: "2024-03", commodity: "Maize", price: 450, market: "Kigali", unit: "kg" },
  { id: 10, date: "2024-03", commodity: "Rice", price: 840, market: "Kigali", unit: "kg" },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const commodity = searchParams.get("commodity")
  const market = searchParams.get("market")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  let filteredData = [...marketData]

  // Apply filters
  if (commodity && commodity !== "all") {
    filteredData = filteredData.filter((item) => item.commodity.toLowerCase().includes(commodity.toLowerCase()))
  }

  if (market && market !== "all") {
    filteredData = filteredData.filter((item) => item.market.toLowerCase().includes(market.toLowerCase()))
  }

  if (startDate) {
    filteredData = filteredData.filter((item) => item.date >= startDate)
  }

  if (endDate) {
    filteredData = filteredData.filter((item) => item.date <= endDate)
  }

  // Calculate price trends
  const commodities = Array.from(new Set(filteredData.map((item) => item.commodity)))
  const trends = commodities.map((commodity) => {
    const commodityData = filteredData.filter((item) => item.commodity === commodity)
    const sortedData = commodityData.sort((a, b) => a.date.localeCompare(b.date))

    if (sortedData.length < 2) return { commodity, trend: "stable", change: 0 }

    const firstPrice = sortedData[0].price
    const lastPrice = sortedData[sortedData.length - 1].price
    const change = ((lastPrice - firstPrice) / firstPrice) * 100

    return {
      commodity,
      trend: change > 5 ? "increasing" : change < -5 ? "decreasing" : "stable",
      change: Number.parseFloat(change.toFixed(2)),
      currentPrice: lastPrice,
    }
  })

  return Response.json({
    data: filteredData,
    trends,
    total: filteredData.length,
  })
}
