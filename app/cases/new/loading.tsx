import { Skeleton } from "@/components/ui/skeleton"

const CasesLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CasesLoading
