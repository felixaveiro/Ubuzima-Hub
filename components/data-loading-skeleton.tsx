import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DataLoadingSkeletonProps {
  rows?: number
  showChart?: boolean
}

export function DataLoadingSkeleton({ rows = 5, showChart = false }: DataLoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Filters Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-24" />
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
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            {/* Table Rows */}
            {Array.from({ length: rows }).map((_, row) => (
              <div key={row} className="grid grid-cols-6 gap-4 py-2">
                {Array.from({ length: 6 }).map((_, col) => (
                  <Skeleton key={col} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Skeleton */}
      {showChart && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
