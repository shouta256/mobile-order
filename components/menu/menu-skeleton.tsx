export default function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/5 animate-pulse" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mt-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mt-1 animate-pulse" />
            <div className="mt-4">
              <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}