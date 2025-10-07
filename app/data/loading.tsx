import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Database, TrendingUp, MapPin } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Data Source Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {i === 1 && <Database className="h-5 w-5 text-primary" />}
                    {i === 2 && <TrendingUp className="h-5 w-5 text-primary" />}
                    {i === 3 && <MapPin className="h-5 w-5 text-primary" />}
                  </div>
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-32" />
            ))}
          </div>

          {/* Filters Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Table Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 pb-2 border-b">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
                {/* Table Rows */}
                {[1, 2, 3, 4, 5].map((row) => (
                  <div key={row} className="grid grid-cols-6 gap-4 py-2">
                    {[1, 2, 3, 4, 5, 6].map((col) => (
                      <Skeleton key={col} className="h-4 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
